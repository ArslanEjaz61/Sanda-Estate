import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
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
          <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} className="w-2 h-2 rounded-full" style={{ background: '#2f1e16' }} />
          <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-2 h-2 rounded-full" style={{ background: '#2f1e16' }} />
          <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-2 h-2 rounded-full" style={{ background: '#2f1e16' }} />
        </div>
      </div>
    </div>
  )
}

// Enhanced inline property card component
function ChatPropertyCard({ property }) {
  const imgUrl = normalizeImageUrl(property.image)
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/properties/${property.id}`)}
      className="group rounded-lg overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-lg transition-all duration-300 mt-2 mb-1 bg-white cursor-pointer hover:border-[#c2a76d]/40"
      style={{ maxWidth: '300px' }}
    >
      {/* Image section */}
      {imgUrl && (
        <div className="relative h-32 overflow-hidden">
          <img src={imgUrl} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {/* Gradient overlay */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.4) 0%, transparent 50%)' }} />
          {/* Price badge */}
          <div className="absolute bottom-2 left-2.5 px-2 py-1 rounded text-[11px] font-bold text-white" style={{ background: 'rgba(47,30,22,0.85)', backdropFilter: 'blur(4px)' }}>
            {property.priceFormatted || `AED ${property.price?.toLocaleString()}`}
          </div>
          {/* Type badge */}
          <div className="absolute top-2 left-2.5 px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold" style={{ background: '#c2a76d', color: '#1a1a1a' }}>
            {property.type || 'Property'}
          </div>
          {property.goldenVisa && (
            <div className="absolute top-2 right-2.5 px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold" style={{ background: 'rgba(194,167,109,0.9)', color: '#1a1a1a' }}>
              Golden Visa
            </div>
          )}
        </div>
      )}
      {/* Details */}
      <div className="p-3">
        <h4 className="text-[12px] font-semibold text-gray-900 leading-tight mb-1.5 line-clamp-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {property.title}
        </h4>
        {/* Location */}
        <div className="flex items-center gap-1 mb-2">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9a9a9a" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span className="text-[10px] text-gray-500">{property.location}</span>
        </div>
        {/* Stats row */}
        <div className="flex items-center gap-3 mb-2.5">
          {property.bedrooms != null && (
            <div className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5"><path d="M3 7v11a1 1 0 001 1h16a1 1 0 001-1V7"/><path d="M21 11H3V8a2 2 0 012-2h14a2 2 0 012 2v3z"/></svg>
              <span className="text-[10px] text-gray-600">{property.bedrooms} Bed</span>
            </div>
          )}
          {property.bathrooms != null && (
            <div className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5"><path d="M4 12h16a1 1 0 011 1v3a4 4 0 01-4 4H7a4 4 0 01-4-4v-3a1 1 0 011-1z"/><path d="M6 12V5a2 2 0 012-2h3"/></svg>
              <span className="text-[10px] text-gray-600">{property.bathrooms} Bath</span>
            </div>
          )}
          {property.area != null && (
            <div className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
              <span className="text-[10px] text-gray-600">{property.area} {property.areaUnit || 'sqft'}</span>
            </div>
          )}
        </div>
        {/* View button */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider group-hover:text-[#c2a76d] transition-colors" style={{ color: '#2f1e16', fontFamily: 'var(--font-body)' }}>
            View Details
          </span>
          <div className="w-6 h-6 rounded-full flex items-center justify-center group-hover:bg-[#c2a76d] transition-colors" style={{ background: '#2f1e16' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Clickable suggestion button
function SuggestionButton({ label, value, onClick, disabled, index }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.06 }}
      type="button"
      disabled={disabled}
      onClick={() => onClick(value)}
      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-medium border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.03] active:scale-[0.97]"
      style={{
        fontFamily: 'var(--font-body)',
        background: 'white',
        borderColor: 'rgba(194,167,109,0.35)',
        color: '#2f1e16',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = '#2f1e16'
        e.currentTarget.style.color = '#fff'
        e.currentTarget.style.borderColor = '#2f1e16'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'white'
        e.currentTarget.style.color = '#2f1e16'
        e.currentTarget.style.borderColor = 'rgba(194,167,109,0.35)'
      }}
      title={value}
    >
      {label}
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-50"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
    </motion.button>
  )
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      text: "Hello! Welcome to Sanda Estate. I'm your personal property advisor. How can I assist you today?\n\nWhich language would you prefer to chat in?",
      sender: 'bot',
      properties: [],
      suggestions: [
        { label: 'English', value: 'English' },
        { label: 'العربية', value: 'العربية' },
        { label: 'اردو', value: 'اردو' },
        { label: 'हिंदी', value: 'हिंदी' },
      ]
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const sendUserMessage = async (userMessage) => {
    const text = String(userMessage || '').trim()
    if (!text || isLoading) return

    const newMessages = [...messages, { text, sender: 'user', properties: [], suggestions: [] }]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      const history = newMessages.map(m => ({ text: m.text, sender: m.sender }))
      const response = await sendChatMessage(text, history)

      const botMessage = {
        text: response.reply,
        sender: 'bot',
        properties: response.properties || [],
        suggestions: Array.isArray(response.suggestions) ? response.suggestions : [],
      }

      setMessages(prev => [...prev, botMessage])
    } catch (err) {
      setMessages(prev => [...prev, {
        text: "I'm sorry, something went wrong. Please try again.",
        sender: 'bot',
        properties: [],
        suggestions: [],
      }])
    } finally {
      setIsLoading(false)
    }
  }

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
    await sendUserMessage(input)
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
            className="absolute bottom-16 right-0 w-[calc(100vw-2rem)] max-w-[400px] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
            style={{ height: '540px', border: '1px solid rgba(0,0,0,0.08)' }}
          >
            {/* Header */}
            <div className="px-4 py-3.5 flex items-center justify-between flex-shrink-0" style={{ background: 'linear-gradient(135deg, #2f1e16, #1a110b)', color: 'white' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #c2a76d, #a88d4a)', boxShadow: '0 2px 8px rgba(194,167,109,0.3)' }}>
                  <span className="text-[10px] font-bold" style={{ color: '#1a1a1a' }}>SE</span>
                </div>
                <div>
                  <div className="text-[13px] font-semibold tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>SE Advisor</div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] text-white/50">Online — Typically replies instantly</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-7 h-7 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all text-sm">✕</button>
            </div>

            {/* Messages */}
            <div className="flex-1 px-3 py-3 overflow-y-auto space-y-3" style={{ scrollbarWidth: 'thin', background: 'linear-gradient(180deg, #f8f7f4, #f2f0ec)' }}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex flex-col gap-2 max-w-[90%]">
                    {/* Bot avatar + text */}
                    {m.sender === 'bot' && (
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5" style={{ background: '#2f1e16' }}>
                          <span className="text-[7px] font-bold" style={{ color: '#c2a76d' }}>SE</span>
                        </div>
                        <div
                          className="p-3 rounded-lg rounded-tl-sm text-[13px] leading-relaxed shadow-sm bg-white text-gray-800 border border-gray-100"
                          style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
                        >
                          {renderText(m.text)}
                        </div>
                      </div>
                    )}
                    {m.sender === 'user' && (
                      <div
                        className="p-3 rounded-lg rounded-tr-sm text-[13px] leading-relaxed shadow-sm text-white"
                        style={{ background: 'linear-gradient(135deg, #2f1e16, #3e2b20)', wordBreak: 'break-word', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
                      >
                        {renderText(m.text)}
                      </div>
                    )}

                    {/* Clickable suggestions */}
                    {m.sender === 'bot' && Array.isArray(m.suggestions) && m.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pl-8">
                        {m.suggestions.slice(0, 10).map((s, idx) => (
                          <SuggestionButton
                            key={`${s.label}-${idx}`}
                            label={s.label}
                            value={s.value}
                            onClick={sendUserMessage}
                            disabled={isLoading}
                            index={idx}
                          />
                        ))}
                      </div>
                    )}

                    {/* Property cards */}
                    {m.sender === 'bot' && m.properties && m.properties.length > 0 && (
                      <div className="space-y-2 pl-8">
                        {m.properties.map((prop, j) => (
                          <ChatPropertyCard key={prop.id || j} property={prop} />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
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
                placeholder={isLoading ? "SE Advisor is typing..." : "Type your message..."}
                disabled={isLoading}
                className="flex-1 px-3.5 py-2.5 text-[13px] bg-[#f7f6f3] rounded-lg outline-none border border-transparent focus:border-[#c2a76d]/40 transition-colors disabled:opacity-50"
                style={{ fontFamily: 'var(--font-body)' }}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 flex items-center justify-center rounded-lg text-white transition-all duration-200 disabled:opacity-30 hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #c2a76d, #a88d4a)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </form>

            {/* Powered by footer */}
            <div className="px-3 pb-2 pt-0 text-center">
              <span className="text-[8px] text-gray-300" style={{ fontFamily: 'var(--font-body)' }}>Powered by Sanda Estate AI</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-[0_8px_25px_rgba(47,30,22,0.35)]"
        style={{ background: 'linear-gradient(135deg, #2f1e16, #1a110b)', border: '2px solid rgba(194,167,109,0.4)' }}
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        )}
      </motion.button>

      {/* Notification dot when closed */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
          style={{ background: '#c2a76d', border: '2px solid white' }}
        >
          <span className="text-[7px] font-bold text-white">1</span>
        </motion.div>
      )}
    </div>
  )
}
