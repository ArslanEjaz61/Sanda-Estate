import express from 'express'
import Property from '../models/Property.js'
import Area from '../models/Area.js'
import Settings from '../models/Settings.js'
import Contact from '../models/Contact.js'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

// Nodemailer transporter (reuse from contact route)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

const LONGCAT_API_URL = 'https://api.longcat.chat/openai/v1/chat/completions'
const LONGCAT_API_KEY = process.env.LONGCAT_API_KEY

// Build system prompt with live database context
async function buildSystemPrompt() {
  const [properties, areas, settings] = await Promise.all([
    Property.find().lean(),
    Area.find().lean(),
    Settings.getSettings()
  ])

  const propertyList = properties.map(p => {
    return `- ID: ${p._id} | "${p.title}" | Type: ${p.type} | Status: ${p.status} | Price: ${p.priceFormatted || 'AED ' + p.price?.toLocaleString()} | Beds: ${p.bedrooms} | Baths: ${p.bathrooms} | Area: ${p.area} ${p.areaUnit} | Location: ${p.location} | Developer: ${p.developer || 'N/A'} | Features: ${(p.features || []).join(', ')} | Golden Visa: ${p.goldenVisa ? 'Yes' : 'No'}`
  }).join('\n')

  const areaList = areas.map(a => {
    return `- "${a.name}" (slug: ${a.slug}) | Tagline: ${a.tagline} | Avg Price: ${a.stats?.avgPrice || 'N/A'} | Rental Yield: ${a.stats?.rentalYield || 'N/A'} | Price Growth: ${a.stats?.priceGrowth || 'N/A'} | Distance from Dubai Mall: ${a.distanceFromDubaiMall || 'N/A'}`
  }).join('\n')

  const companyInfo = {
    address: settings?.address || 'A-202, Prime Business Center, POBOX: 123022, Dubai, UAE',
    phone: settings?.phone || '+971 4 454 1313',
    email: settings?.email || 'info@yourhomes.ae',
    whatsapp: settings?.whatsapp || '',
  }

  return `You are "YH Advisor" — the friendly, warm, and professional AI property consultant for Your Homes Dubai.

CRITICAL RULES:
1. You must always sound like a REAL HUMAN having a natural conversation — warm, friendly, approachable. Use casual friendly language naturally. Never sound robotic.
2. On the VERY FIRST message from a user (like "hi", "hello", "hey", etc.), greet them warmly and ask: "Which language would you prefer to chat in? 🌍 English, العربية, اردو, हिंदी, or any other?" 
3. Once the user tells you their preferred language, REMEMBER IT and continue ALL future responses in THAT language only.
4. Be conversational — use emojis occasionally, ask follow-up questions naturally, show genuine interest.
5. NEVER break character. You are a real property advisor, not an AI.
6. Ask ONE question at a time. Don't overwhelm the user with multiple questions.

COMPANY INFORMATION:
- Company: Your Homes Dubai — Premium Real Estate Advisory
- Address: ${companyInfo.address}
- Phone: ${companyInfo.phone}
- Email: ${companyInfo.email}
- WhatsApp: ${companyInfo.whatsapp || companyInfo.phone}
- Working Hours: Sunday to Thursday, 9:00 AM – 6:00 PM (GST). Saturday 10:00 AM – 2:00 PM. Friday Closed.
- Website: www.yourhomes.ae

CONVERSATION FLOW:
1. Greet → Ask language preference
2. Ask: "Are you looking to buy, sell, or rent a property?" 
3. Based on interest, ask about property type preference (Villa, Apartment, Penthouse, Townhouse)
4. Ask about preferred area/location in Dubai
5. Ask about budget range
6. Suggest matching properties from our database with details
7. After suggesting properties, naturally ask: "Would you like to go ahead with any of these, or are you just exploring for now?"
8. Based on their answer, follow the LEAD SCENARIOS below

WHEN SUGGESTING PROPERTIES:
- Share property details naturally in conversation (title, type, price, beds, location, key features)
- Include the property link in this format: [VIEW_PROPERTY:property_id_here]
- Suggest 2-3 matching properties at a time, not more
- If no exact match, suggest the closest options and explain why

═══════════════════════════════════════════
LEAD SCENARIO 1: USER WANTS TO TALK TO AN AGENT
═══════════════════════════════════════════
When the user says things like "I want to talk to someone", "connect me to agent", "can I speak to a person", etc.:
- Step 1: Say warmly "Of course! Let me connect you with one of our senior advisors 😊"
- Step 2: Ask "Could you share your full name please?" (ONLY ask name, nothing else)
- Step 3: WAIT for their name. Then ask "And your phone number so our advisor can reach you?"
- Step 4: WAIT for their phone. Then include this tag: [LEAD:name|phone|regular]
- Step 5: Confirm: "Perfect! Our advisor will reach out to you very soon. Thank you! 🙏"

═══════════════════════════════════════════
LEAD SCENARIO 2: HOT LEAD (User shows buying/renting intent)
═══════════════════════════════════════════
When you sense the user is GENUINELY INTERESTED in buying or renting (not just browsing):
Signs of a hot lead:
- They say "I want to buy this", "I'm interested", "How do I proceed?", "I want to book", "I like this one"
- They ask about payment plans, handover dates, booking amounts
- They discuss specific property details seriously
- They compare specific units or ask "which one should I go for?"

When you detect this:
- Step 1: Ask naturally "That's great! Are you looking to go ahead with the purchase/rental, or would you like to explore a bit more?" 
- Step 2: If they confirm interest, say "Wonderful! Let me have our best advisor reach out to assist you personally 😊"
- Step 3: Ask "May I have your name please?"
- Step 4: WAIT for name. Then ask "And the best phone number to reach you?"
- Step 5: WAIT for phone. Also ask "Do you have an email address?" (email is optional)
- Step 6: Include this tag: [HOTLEAD:name|phone|email|interest_details]
  - interest_details should briefly describe what they want (e.g., "wants to buy Villa in Palm Jumeirah, budget 5M")
- Step 7: Confirm enthusiastically: "Amazing! I've flagged you as a priority client. One of our senior advisors will call you very shortly to help you move forward! 🏠✨"

IMPORTANT LEAD RULES:
- ALWAYS ask name FIRST, then phone SEPARATELY. Never ask both at once.
- WAIT for the user to respond before asking the next question.
- For HOT LEADS, also ask for email (but it's optional — if they skip it, use "N/A")
- NEVER fabricate or guess contact details. Only use what the user actually provides.
- Once you use a [LEAD:...] or [HOTLEAD:...] tag, do NOT use it again in the same conversation.

AVAILABLE PROPERTIES IN OUR DATABASE:
${propertyList || 'No properties currently loaded.'}

AVAILABLE AREAS WE COVER:
${areaList || 'No areas currently loaded.'}

ABOUT YOUR HOMES DUBAI:
Your Homes is a premium real estate advisory firm based in Dubai with 22+ years of expertise. We have transacted over AED 2.8 Billion in portfolio value, sold 1200+ properties, and serve clients from 40+ countries. We specialize in luxury property sales, Golden Visa advisory, and investment consultancy across Dubai's most prestigious communities.

RESPONSE FORMAT:
Always respond in plain text — natural, conversational, human-like. When suggesting properties, include [VIEW_PROPERTY:id] tags. For regular leads include [LEAD:name|phone|regular]. For hot leads include [HOTLEAD:name|phone|email|interest]. These tags will be parsed by the system and are NOT shown to the user.`
}


// POST /api/chat
router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body

    if (!message) {
      return res.status(400).json({ message: 'Message is required' })
    }

    if (!LONGCAT_API_KEY) {
      return res.status(500).json({ message: 'Chat API key not configured' })
    }

    // Build system prompt with live data
    const systemPrompt = await buildSystemPrompt()

    // Build messages array for the API
    const messages = [
      { role: 'system', content: systemPrompt }
    ]

    // Add conversation history
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        messages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        })
      }
    }

    // Add the current message
    messages.push({ role: 'user', content: message })

    // Call Longcat API
    const response = await fetch(LONGCAT_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LONGCAT_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'LongCat-Flash-Chat',
        messages: messages,
        max_tokens: 2000,
        temperature: 0.75,
      })
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('Longcat API error:', response.status, errorBody)
      return res.status(500).json({ message: 'AI service temporarily unavailable. Please try again.' })
    }

    const data = await response.json()
    let aiReply = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that. Could you try again?"

    // Parse property references [VIEW_PROPERTY:id]
    const propertyIds = []
    const propertyRegex = /\[VIEW_PROPERTY:([^\]]+)\]/g
    let match
    while ((match = propertyRegex.exec(aiReply)) !== null) {
      propertyIds.push(match[1].trim())
    }
    // Remove tags from the visible reply
    const cleanReply = aiReply.replace(/\[VIEW_PROPERTY:[^\]]+\]/g, '').trim()

    // Parse lead collection — TWO SCENARIOS
    let leadCollected = false
    let leadType = null // 'regular' or 'hot'

    // Scenario 1: Regular Lead [LEAD:name|phone|regular]
    const regularLeadRegex = /\[LEAD:([^|]+)\|([^|]+)\|([^\]]+)\]/
    const regularMatch = regularLeadRegex.exec(aiReply)

    // Scenario 2: Hot Lead [HOTLEAD:name|phone|email|interest]
    const hotLeadRegex = /\[HOTLEAD:([^|]+)\|([^|]+)\|([^|]+)\|([^\]]+)\]/
    const hotMatch = hotLeadRegex.exec(aiReply)

    if (hotMatch) {
      // HOT LEAD — priority client
      const leadName = hotMatch[1].trim()
      const leadPhone = hotMatch[2].trim()
      const leadEmail = hotMatch[3].trim()
      const interestDetails = hotMatch[4].trim()
      leadType = 'hot'

      try {
        const contact = new Contact({
          name: leadName,
          phone: leadPhone,
          email: leadEmail !== 'N/A' ? leadEmail : '',
          message: `🔥 [HOT LEAD — Chatbot] ${interestDetails}`,
          status: 'unread'
        })
        await contact.save()
        leadCollected = true

        // Send HOT LEAD email to agent
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `🔥 HOT LEAD — ${leadName} wants to proceed!`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px;">
                <div style="background: #d4380d; color: white; padding: 16px 24px; border-radius: 8px 8px 0 0;">
                  <h2 style="margin: 0;">🔥 HOT LEAD — Priority Client</h2>
                </div>
                <div style="background: #fff8f0; padding: 24px; border: 1px solid #ffd6c0; border-radius: 0 0 8px 8px;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px 0; font-weight: bold; color: #333;">Name:</td><td style="padding: 8px 0; color: #555;">${leadName}</td></tr>
                    <tr><td style="padding: 8px 0; font-weight: bold; color: #333;">Phone:</td><td style="padding: 8px 0; color: #555;">${leadPhone}</td></tr>
                    <tr><td style="padding: 8px 0; font-weight: bold; color: #333;">Email:</td><td style="padding: 8px 0; color: #555;">${leadEmail !== 'N/A' ? leadEmail : 'Not provided'}</td></tr>
                    <tr><td style="padding: 8px 0; font-weight: bold; color: #333;">Interest:</td><td style="padding: 8px 0; color: #d4380d; font-weight: bold;">${interestDetails}</td></tr>
                    <tr><td style="padding: 8px 0; font-weight: bold; color: #333;">Source:</td><td style="padding: 8px 0; color: #555;">Website Chatbot</td></tr>
                    <tr><td style="padding: 8px 0; font-weight: bold; color: #333;">Time:</td><td style="padding: 8px 0; color: #555;">${new Date().toLocaleString('en-AE', { timeZone: 'Asia/Dubai' })}</td></tr>
                  </table>
                  <hr style="margin: 16px 0; border: none; border-top: 1px solid #ffd6c0;" />
                  <p style="color: #d4380d; font-weight: bold; margin: 0;">⚡ This client is ready to proceed. Please contact them ASAP!</p>
                </div>
              </div>
            `
          }
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.error('Hot lead email error:', error)
            else console.log('🔥 Hot lead email sent:', info.response)
          })
        }
      } catch (err) {
        console.error('Error saving hot lead:', err)
      }

    } else if (regularMatch) {
      // REGULAR LEAD — wants to talk to agent
      const leadName = regularMatch[1].trim()
      const leadPhone = regularMatch[2].trim()
      leadType = 'regular'

      try {
        const contact = new Contact({
          name: leadName,
          phone: leadPhone,
          email: '',
          message: `[Chatbot Lead] Client wants to speak with an agent.`,
          status: 'unread'
        })
        await contact.save()
        leadCollected = true

        // Send regular lead email to agent
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `📞 New Chatbot Lead — ${leadName} wants to talk`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px;">
                <div style="background: #0e3a2f; color: white; padding: 16px 24px; border-radius: 8px 8px 0 0;">
                  <h2 style="margin: 0;">📞 Client Wants to Talk to You</h2>
                </div>
                <div style="background: #f7f6f3; padding: 24px; border: 1px solid #e5e0d9; border-radius: 0 0 8px 8px;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px 0; font-weight: bold; color: #333;">Name:</td><td style="padding: 8px 0; color: #555;">${leadName}</td></tr>
                    <tr><td style="padding: 8px 0; font-weight: bold; color: #333;">Phone:</td><td style="padding: 8px 0; color: #555;">${leadPhone}</td></tr>
                    <tr><td style="padding: 8px 0; font-weight: bold; color: #333;">Source:</td><td style="padding: 8px 0; color: #555;">Website Chatbot</td></tr>
                    <tr><td style="padding: 8px 0; font-weight: bold; color: #333;">Time:</td><td style="padding: 8px 0; color: #555;">${new Date().toLocaleString('en-AE', { timeZone: 'Asia/Dubai' })}</td></tr>
                  </table>
                  <hr style="margin: 16px 0; border: none; border-top: 1px solid #e5e0d9;" />
                  <p style="color: #666; margin: 0;">This client requested to speak with an agent via the chatbot. Please reach out to them.</p>
                </div>
              </div>
            `
          }
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.error('Lead email error:', error)
            else console.log('📞 Lead email sent:', info.response)
          })
        }
      } catch (err) {
        console.error('Error saving regular lead:', err)
      }
    }


    // Fetch full property data for referenced properties
    let suggestedProperties = []
    if (propertyIds.length > 0) {
      try {
        suggestedProperties = await Property.find({ _id: { $in: propertyIds } }).lean()
        suggestedProperties = suggestedProperties.map(p => ({
          id: p._id,
          title: p.title,
          type: p.type,
          price: p.price,
          priceFormatted: p.priceFormatted,
          bedrooms: p.bedrooms,
          bathrooms: p.bathrooms,
          area: p.area,
          areaUnit: p.areaUnit,
          location: p.location,
          locationSlug: p.locationSlug,
          image: p.image,
          goldenVisa: p.goldenVisa,
        }))
      } catch (err) {
        console.error('Error fetching property details:', err)
      }
    }

    // Clean the reply of any remaining tags
    const finalReply = cleanReply
      .replace(/\[LEAD:[^\]]+\]/g, '')
      .replace(/\[HOTLEAD:[^\]]+\]/g, '')
      .replace(/\[LEAD_COLLECTED:[^\]]+\]/g, '')
      .trim()

    res.json({
      reply: finalReply,
      properties: suggestedProperties,
      leadCollected,
      leadType
    })

  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ message: 'Something went wrong. Please try again.' })
  }
})

export default router
