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
7. If they want to speak to a human agent, ask for their Name and Phone Number
8. Once you have their Name + Phone, confirm you'll have an agent reach out soon

WHEN SUGGESTING PROPERTIES:
- Share property details naturally in conversation (title, type, price, beds, location, key features)
- Include the property link in this format: [VIEW_PROPERTY:property_id_here]
- Suggest 2-3 matching properties at a time, not more
- If no exact match, suggest the closest options and explain why

WHEN USER WANTS TO TALK TO AN AGENT:
- Say something like "Of course! I'd be happy to connect you with one of our senior advisors."
- Ask for their full name and phone number
- When you have BOTH name AND phone, include this in your response: [LEAD_COLLECTED:name|phone]
- Confirm that an advisor will reach out to them shortly

AVAILABLE PROPERTIES IN OUR DATABASE:
${propertyList || 'No properties currently loaded.'}

AVAILABLE AREAS WE COVER:
${areaList || 'No areas currently loaded.'}

ABOUT YOUR HOMES DUBAI:
Your Homes is a premium real estate advisory firm based in Dubai with 22+ years of expertise. We have transacted over AED 2.8 Billion in portfolio value, sold 1200+ properties, and serve clients from 40+ countries. We specialize in luxury property sales, Golden Visa advisory, and investment consultancy across Dubai's most prestigious communities.

RESPONSE FORMAT:
Always respond in plain text — natural, conversational, human-like. When suggesting properties, include [VIEW_PROPERTY:id] tags. When collecting leads, include [LEAD_COLLECTED:name|phone] tags. These tags will be parsed by the system and are NOT shown to the user.`
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

    // Parse lead collection [LEAD_COLLECTED:name|phone]
    let leadCollected = false
    const leadRegex = /\[LEAD_COLLECTED:([^|]+)\|([^\]]+)\]/
    const leadMatch = leadRegex.exec(aiReply)
    if (leadMatch) {
      const leadName = leadMatch[1].trim()
      const leadPhone = leadMatch[2].trim()

      // Save to Contact collection
      try {
        const contact = new Contact({
          name: leadName,
          phone: leadPhone,
          email: '',
          message: `[Chatbot Lead] This lead was collected via the YH Advisor chatbot. The user wanted to speak with an agent.`,
          status: 'unread'
        })
        await contact.save()
        leadCollected = true

        // Send email to agent
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `🤖 New Chatbot Lead — ${leadName}`,
            html: `
              <h3>New Lead from YH Advisor Chatbot</h3>
              <p><strong>Name:</strong> ${leadName}</p>
              <p><strong>Phone:</strong> ${leadPhone}</p>
              <p><strong>Source:</strong> Website Chatbot</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString('en-AE', { timeZone: 'Asia/Dubai' })}</p>
              <hr/>
              <p style="color: #666;">This lead was automatically collected when the visitor requested to speak with an agent via the chatbot.</p>
            `
          }
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.error('Lead email error:', error)
            else console.log('Lead email sent:', info.response)
          })
        }
      } catch (err) {
        console.error('Error saving chatbot lead:', err)
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
    const finalReply = cleanReply.replace(/\[LEAD_COLLECTED:[^\]]+\]/g, '').trim()

    res.json({
      reply: finalReply,
      properties: suggestedProperties,
      leadCollected
    })

  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ message: 'Something went wrong. Please try again.' })
  }
})

export default router
