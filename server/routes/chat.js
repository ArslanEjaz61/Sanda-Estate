import express from 'express'
import Property from '../models/Property.js'
import Area from '../models/Area.js'
import Settings from '../models/Settings.js'
import Contact from '../models/Contact.js'
import TeamMember from '../models/TeamMember.js'
import dotenv from 'dotenv'
import { resolveSmtpAuth, createMailTransport } from '../utils/mail.js'

dotenv.config()

const router = express.Router()

const LONGCAT_API_URL = 'https://api.longcat.chat/openai/v1/chat/completions'
const LONGCAT_API_KEY = process.env.LONGCAT_API_KEY

// Cache system prompt to avoid rebuilding on every request
let cachedPrompt = null
let cacheTimestamp = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

async function getCachedSystemPrompt() {
  const now = Date.now()
  if (cachedPrompt && (now - cacheTimestamp) < CACHE_TTL) {
    return cachedPrompt
  }
  cachedPrompt = await buildSystemPrompt()
  cacheTimestamp = now
  return cachedPrompt
}

// Build system prompt with live database context
async function buildSystemPrompt() {
  const [properties, areas, settings] = await Promise.all([
    Property.find().lean(),
    Area.find().lean(),
    Settings.getSettings()
  ])

  const teamRoutable = await TeamMember.find({
    isActive: true,
    routingKey: { $ne: '' },
    notifyEmail: { $ne: '' },
  }).sort({ sortOrder: 1, createdAt: -1 }).lean()

  const propertyList = properties.map(p => {
    const gv = p.goldenVisa ? ' | GV:Yes' : ''
    return `- ID:${p._id} | "${p.title}" | ${p.type} | ${p.status} | ${p.priceFormatted || 'AED ' + p.price?.toLocaleString()} | ${p.bedrooms}BR/${p.bathrooms}BA | ${p.area}${p.areaUnit} | ${p.location}${gv}`
  }).join('\n')

  const areaList = areas.map(a => {
    return `- "${a.name}" (${a.slug}) | ${a.stats?.avgPrice || 'N/A'} avg | Yield:${a.stats?.rentalYield || 'N/A'}`
  }).join('\n')

  const areaNameBySlug = Object.fromEntries(areas.map((a) => [a.slug, a.name]))

  const companyInfo = {
    address: settings?.address || 'A-202, Prime Business Center, POBOX: 123022, Dubai, UAE',
    phone: settings?.phone || '+971 4 454 1313',
    email: settings?.email || 'info@yourhomes.ae',
    whatsapp: settings?.whatsapp || '',
  }

  return `You are "YH Advisor" — the friendly, warm, and professional AI property consultant for Your Homes Dubai.

CRITICAL RULES:
1. You must always sound like a REAL HUMAN having a natural conversation — warm, friendly, approachable. Use casual friendly language naturally. Never sound robotic.
2. On the VERY FIRST message from a user (like "hi", "hello", "hey", etc.), greet them warmly and ask: "Which language would you prefer to chat in? English, العربية, اردو, हिंदी, or any other?"
3. Once the user tells you their preferred language, REMEMBER IT and continue ALL future responses in THAT language only.
4. IMPORTANT: Do NOT use emojis, emoticons, or decorative symbols in your replies. Keep replies plain text only.
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
- Step 1: Say warmly "Of course! Let me connect you with one of our senior advisors."
- Step 2: Ask "Could you share your full name please?" (ONLY ask name, nothing else)
- Step 3: WAIT for their name. Then ask "And your phone number so our advisor can reach you?"
- Step 4: WAIT for their phone. Then include this tag: [LEAD:name|phone|regular]
- Step 5: Confirm: "Perfect! Our advisor will reach out to you very soon. Thank you."

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
- Step 2: If they confirm interest, say "Wonderful! Let me have our best advisor reach out to assist you personally."
- Step 3: Ask "May I have your name please?"
- Step 4: WAIT for name. Then ask "And the best phone number to reach you?"
- Step 5: WAIT for phone. Also ask "Do you have an email address?" (email is optional)
- Step 6: Include this tag: [HOTLEAD:name|phone|email|interest_details]
  - interest_details should briefly describe what they want (e.g., "wants to buy Villa in Palm Jumeirah, budget 5M")
- Step 7: Confirm enthusiastically: "Amazing! I've flagged you as a priority client. One of our senior advisors will call you very shortly to help you move forward!"

${(() => {
  const routable = Array.isArray(teamRoutable) ? teamRoutable : []
  if (!routable.length) return ''
  return `═══════════════════════════════════════════
LEAD SCENARIO 3: USER WANTS A SPECIFIC ADVISOR (Founder, investment advisory, named leader)
═══════════════════════════════════════════
Examples: "I want to speak to the founder", "connect me to investment advisory", "Chief Advisory Officer".

Internal team routing (never read routing keys aloud; use only in the hidden tag):
${routable.map((t) => {
  const line = String(t.phone || '').trim()
  const phoneHint = line ? ` Advisor mobile (from CRM, optional to mention if user asks): ${line}.` : ''
  const slug = t.areaSlug ? String(t.areaSlug).trim() : ''
  const areaHint = slug && areaNameBySlug[slug] ? ` Primary area: ${areaNameBySlug[slug]}.` : ''
  return `- routingKey "${String(t.routingKey).trim()}": ${t.role || ''} — ${t.name || ''}.${areaHint}${phoneHint} Hints: ${String(t.routingKeywords || t.role || '').trim()}`
}).join('\n')}

Flow:
1. Acknowledge warmly and confirm you will connect them with the right person.
2. Ask for their full name and wait.
3. Ask for their phone number and wait.
4. Output exactly one tag: [TEAM_LEAD:full_name|phone|routingKey]
   The routingKey must match one of the keys listed above (e.g. founder vs investment).
5. If unsure which routingKey, ask one short clarifying question first.

`
})()}
IMPORTANT LEAD RULES:
- ALWAYS ask name FIRST, then phone SEPARATELY. Never ask both at once.
- WAIT for the user to respond before asking the next question.
- For HOT LEADS, also ask for email (but it's optional — if they skip it, use "N/A")
- NEVER fabricate or guess contact details. Only use what the user actually provides.
- Once you use a [LEAD:...], [HOTLEAD:...], or [TEAM_LEAD:...] tag, do NOT use it again in the same conversation.

AVAILABLE PROPERTIES IN OUR DATABASE:
${propertyList || 'No properties currently loaded.'}

AVAILABLE AREAS WE COVER:
${areaList || 'No areas currently loaded.'}

ABOUT YOUR HOMES DUBAI:
Your Homes is a premium real estate advisory firm based in Dubai with 22+ years of expertise. We have transacted over AED 2.8 Billion in portfolio value, sold 1200+ properties, and serve clients from 40+ countries. We specialize in luxury property sales, Golden Visa advisory, and investment consultancy across Dubai's most prestigious communities.

RESPONSE FORMAT:
Always respond in plain text — natural, conversational, human-like. When suggesting properties, include [VIEW_PROPERTY:id] tags. For regular leads include [LEAD:name|phone|regular]. For hot leads include [HOTLEAD:name|phone|email|interest]. For a specific advisor handoff include [TEAM_LEAD:name|phone|routingKey]. These tags will be parsed by the system and are NOT shown to the user.`
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

    // Build system prompt (cached for 5 min)
    const systemPrompt = await getCachedSystemPrompt()

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

    // Call Longcat API with timeout and retry
    const MAX_RETRIES = 2
    let lastError = null
    let data = null

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 60000) // 60s timeout

        const response = await fetch(LONGCAT_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LONGCAT_API_KEY}`,
            'Content-Type': 'application/json',
            'Connection': 'keep-alive'
          },
          body: JSON.stringify({
            model: 'LongCat-Flash-Chat',
            messages: messages,
            max_tokens: 1500,
            temperature: 0.7,
          }),
          signal: controller.signal
        })

        clearTimeout(timeout)

        if (!response.ok) {
          const errorBody = await response.text()
          console.error(`Longcat API error (attempt ${attempt + 1}):`, response.status, errorBody)
          lastError = new Error(`API returned ${response.status}`)
          continue
        }

        data = await response.json()
        break // success, stop retrying
      } catch (err) {
        console.error(`Longcat API fetch error (attempt ${attempt + 1}):`, err.message)
        lastError = err
        if (attempt < MAX_RETRIES) {
          await new Promise(r => setTimeout(r, 1000)) // wait 1s before retry
        }
      }
    }

    if (!data) {
      console.error('All Longcat API attempts failed:', lastError?.message)
      return res.status(500).json({ message: 'AI service temporarily unavailable. Please try again.' })
    }

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
    let leadType = null // 'regular' | 'hot' | 'team'

    // Scenario 1: Regular Lead [LEAD:name|phone|regular]
    const regularLeadRegex = /\[LEAD:([^|]+)\|([^|]+)\|([^\]]+)\]/
    const regularMatch = regularLeadRegex.exec(aiReply)

    // Scenario 2: Hot Lead [HOTLEAD:name|phone|email|interest]
    const hotLeadRegex = /\[HOTLEAD:([^|]+)\|([^|]+)\|([^|]+)\|([^\]]+)\]/
    const hotMatch = hotLeadRegex.exec(aiReply)

    // Scenario 3: Team routing [TEAM_LEAD:name|phone|routingKey]
    const teamLeadRegex = /\[TEAM_LEAD:([^|]+)\|([^|]+)\|([^\]]+)\]/
    const teamMatch = teamLeadRegex.exec(aiReply)

    if (teamMatch) {
      const clientName = teamMatch[1].trim()
      const clientPhone = teamMatch[2].trim()
      const routingKey = teamMatch[3].trim()

      try {
        const rk = routingKey.toLowerCase()
        const member = await TeamMember.findOne({ routingKey: new RegExp(`^${rk}$`, 'i') }).lean()
        const { user: smtpUser, pass: smtpPass, hasAuth } = await resolveSmtpAuth()

        const contact = new Contact({
          name: clientName,
          phone: clientPhone,
          email: '',
          message: `[Chatbot — team handoff] routingKey="${routingKey}" (${member?.role || 'unknown role'}). Last user message: ${String(message).slice(0, 500)}`,
          status: 'unread'
        })
        await contact.save()
        leadCollected = true
        leadType = 'team'

        const toAddr = (member && member.notifyEmail && String(member.notifyEmail).trim())
          ? String(member.notifyEmail).trim()
          : smtpUser

        if (hasAuth && toAddr) {
          const transport = createMailTransport(smtpUser, smtpPass)
          const subject = `Chatbot: ${clientName} wants to speak with ${member?.role || routingKey}`
          const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px;">
              <h2 style="color: #0e3a2f;">Client requested a specific advisor</h2>
              <p><strong>Advisor:</strong> ${member?.name || '—'} — ${member?.role || routingKey}</p>
              ${member?.phone && String(member.phone).trim() ? `<p><strong>Advisor mobile:</strong> ${String(member.phone).trim()}</p>` : ''}
              <p><strong>Client name:</strong> ${clientName}</p>
              <p><strong>Client phone:</strong> ${clientPhone}</p>
              <p><strong>Routing key:</strong> ${routingKey}</p>
              <p><strong>Latest user message:</strong></p>
              <p style="background:#f7f6f3;padding:12px;border-radius:6px;">${String(message).replace(/</g, '&lt;')}</p>
              <p style="color:#666;font-size:12px;">${new Date().toLocaleString('en-AE', { timeZone: 'Asia/Dubai' })} — Website chatbot</p>
            </div>`
          transport.sendMail({
            from: smtpUser,
            to: toAddr,
            subject,
            html,
          }, (error, info) => {
            if (error) console.error('Team routing email error:', error)
            else console.log('Team routing email sent:', info?.response)
          })
        }
      } catch (err) {
        console.error('Team lead handling error:', err)
      }
    } else if (hotMatch) {
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

        const { user: smtpUser, pass: smtpPass, hasAuth } = await resolveSmtpAuth()
        if (hasAuth) {
          const transport = createMailTransport(smtpUser, smtpPass)
          const mailOptions = {
            from: smtpUser,
            to: smtpUser,
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
          transport.sendMail(mailOptions, (error, info) => {
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

        const { user: smtpUser, pass: smtpPass, hasAuth } = await resolveSmtpAuth()
        if (hasAuth) {
          const transport = createMailTransport(smtpUser, smtpPass)
          const mailOptions = {
            from: smtpUser,
            to: smtpUser,
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
          transport.sendMail(mailOptions, (error, info) => {
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
      .replace(/\[TEAM_LEAD:[^\]]+\]/g, '')
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
