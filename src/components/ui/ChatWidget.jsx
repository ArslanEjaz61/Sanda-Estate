import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { text: 'Hello! I am your AI property advisor. How can I assist you with Dubai real estate today?', sender: 'bot' }
  ])
  const [input, setInput] = useState('')

  const handleSend = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    setMessages(prev => [...prev, { text: input, sender: 'user' }])
    setInput('')
    setTimeout(() => {
      setMessages(prev => [...prev, { text: 'Thank you for your message. One of our senior advisors will contact you shortly.', sender: 'bot' }])
    }, 1000)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-16 right-0 w-[calc(100vw-3rem)] max-w-sm bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col border border-gray-100"
            style={{ height: '400px' }}
          >
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between" style={{ background: '#064e3b', color: 'white' }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#c9a84c] animate-pulse"></div>
                <span className="text-[13px] font-semibold tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>Property Advisor</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors">✕</button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#faf8f5]">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-lg text-[13px] leading-relaxed shadow-sm ${m.sender === 'user' ? 'bg-[#064e3b] text-white rounded-tr-sm' : 'bg-white text-gray-800 rounded-tl-sm border border-gray-100'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 text-[13px] bg-[#faf8f5] rounded-md outline-none border border-transparent focus:border-[#c9a84c]/40 transition-colors"
              />
              <button type="submit" className="w-9 h-9 flex items-center justify-center rounded-md bg-[#c9a84c] text-white hover:bg-[#b8953b] transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-[0_8px_20px_rgba(6,78,59,0.3)] hover:scale-105 transition-transform"
        style={{ background: 'linear-gradient(135deg, #064e3b, #04382a)' }}
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
