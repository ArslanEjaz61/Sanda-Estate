import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { sendChatMessage } from '../../utils/api'

const SERVER_BASE = import.meta.env.VITE_SERVER_BASE

function normalizeImageUrl(url) {
  if (!url) return null
  if (url.startsWith('http')) return url
  if (url.startsWith('/uploads')) return `${SERVER_BASE}${url}`
  return url
}

// Typing indicator dots
function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-white text-gray-800 rounded-lg rounded-tl-sm border border-gray-100 p-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} className="w-2 h-2 rounded-full" style={{ background: '#0e3a2f' }} />
          <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-2 h-2 rounded-full" style={{ background: '#0e3a2f' }} />
          <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-2 h-2 rounded-full" style={{ background: '#0e3a2f' }} />
        </div>
      </div>
    </div>
  )
}

// Inline property card component
function PropertyCard({ property }) {
  const imgUrl = normalizeImageUrl(property.image)
  return (
    <Link
      to={`/properties/${property.id}`}
      className="block rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow mt-2 mb-1 bg-white"
      style={{ maxWidth: '280px' }}
    >
      {imgUrl && (
        <div className="h-28 overflow-hidden">
          <img src={imgUrl} alt={property.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-3">
        <h4 className="text-[12px] font-semibold text-gray-900 leading-tight mb-1 line-clamp-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {property.title}
        </h4>
        <div className="text-[11px] text-gray-500 mb-1.5">{property.location}</div>
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-bold" style={{ color: '#0e3a2f' }}>
            {property.priceFormatted || `AED ${property.price?.toLocaleString()}`}
          </span>
          <span className="text-[10px] text-gray-400">
            {property.bedrooms} Bed · {property.bathrooms} Bath
          </span>
        </div>
        {property.goldenVisa && (
          <span className="inline-block text-[8px] uppercase tracking-wider font-bold mt-1.5 px-2 py-0.5 rounded-sm" style={{ background: 'rgba(194,167,109,0.15)', color: '#c2a76d' }}>
            Golden Visa
          </span>
        )}
      </div>
    </Link>
  )
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      text: "Hello! Welcome to Your Homes Dubai. I'm your personal property advisor. How can I assist you today?\n\nWhich language would you prefer to chat in?\nEnglish, العربية, اردو, हिंदी, or any other?",
      sender: 'bot',
      properties: []
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 300)
    }
  }, [isOpen])

  const handleSend = async (e) => {
    e.preventDefault()
    const userMessage = input.trim()
    if (!userMessage || isLoading) return

    // Add user message
    const newMessages = [...messages, { text: userMessage, sender: 'user', properties: [] }]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      // Build history (exclude the initial greeting for cleaner context)
      const history = newMessages.map(m => ({ text: m.text, sender: m.sender }))

      const response = await sendChatMessage(userMessage, history)

      const botMessage = {
        text: response.reply,
        sender: 'bot',
        properties: response.properties || []
      }

      setMessages(prev => [...prev, botMessage])
    } catch (err) {
      setMessages(prev => [...prev, {
        text: "I'm sorry, something went wrong. Please try again.",
        sender: 'bot',
        properties: []
      }])
    } finally {
      setIsLoading(false)
    }
  }

  // Render message text with line breaks
  const renderText = (text) => {
    if (!text) return null
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ))
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-16 right-0 w-[calc(100vw-3rem)] max-w-sm bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col"
            style={{ height: '480px', border: '1.5px solid rgba(247, 246, 243, 0.4)' }}
          >
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between flex-shrink-0" style={{ background: '#0e3a2f', color: 'white' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#c2a76d' }}>
                  <span className="text-[9px] font-bold" style={{ color: '#1a1a1a' }}>YH</span>
                </div>
                <div>
                  <div className="text-[13px] font-semibold tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>YH Advisor</div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] text-white/50">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors text-lg">✕</button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f7f6f3]" style={{ scrollbarWidth: 'thin' }}>
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="flex flex-col gap-1.5 max-w-[88%]">
                    {/* Text bubble */}
                    <div
                      className={`p-3 rounded-lg text-[13px] leading-relaxed shadow-sm ${
                        m.sender === 'user'
                          ? 'bg-[#0e3a2f] text-white rounded-tr-sm'
                          : 'bg-white text-gray-800 rounded-tl-sm border border-gray-100'
                      }`}
                      style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
                    >
                      {renderText(m.text)}
                    </div>

                    {/* Property cards (if any) */}
                    {m.properties && m.properties.length > 0 && (
                      <div className="space-y-2">
                        {m.properties.map((prop, j) => (
                          <PropertyCard key={j} property={prop} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2 flex-shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={isLoading ? "YH Advisor is typing..." : "Type your message..."}
                disabled={isLoading}
                className="flex-1 px-3 py-2 text-[13px] bg-[#f7f6f3] rounded-md outline-none border border-transparent focus:border-[#c2a76d]/40 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-9 h-9 flex items-center justify-center rounded-md bg-[#c2a76d] text-white hover:bg-[#b8973b] transition-colors disabled:opacity-40"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-[0_8px_20px_rgba(14,58,47,0.3)] hover:scale-105 transition-transform"
        style={{ background: 'linear-gradient(135deg, #0e3a2f, #04382a)', border: '2px solid rgba(247, 246, 243, 0.3)' }}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        )}
      </button>
    </div>
  )
}
