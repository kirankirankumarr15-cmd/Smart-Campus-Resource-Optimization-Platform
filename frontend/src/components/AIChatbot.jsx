import { useState, useEffect, useRef } from 'react'
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react'
import { useCampus } from '../context/CampusStateContext.jsx'

const INITIAL_MESSAGE = {
  id: 1,
  text: "Hello! I'm your PESITM Campus Assistant. How can I help you navigate or optimize your day today?",
  sender: 'bot',
  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const FAQ = [
  { q: "Where is Block A?", a: "Block A (CSE Wing) is located near the Main Entrance. I can open the Navigator for you to see the exact route!" },
  { q: "How much energy did we save?", a: "We've saved 128 kWh today! That's equivalent to planting 6 trees. You can see the full breakdown in the Impact Dashboard." },
  { q: "Find me a quiet study spot", a: "Currently, Room A-207 and B-105 are 'Deep Work' zones with low noise and optimal CO2. Would you like the route?" },
  { q: "Report a faulty AC", a: "Sure! Please go to the 'Maintenance' page or just tell me the room number, and I'll notify the Facility team immediately." }
]

export default function AIChatbot() {
  const { state } = useCampus()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSend = (text = input) => {
    if (!text.trim()) return
    
    const userMsg = {
      id: Date.now(),
      text,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    // Simulate AI thinking
    setTimeout(() => {
      const responseText = getAIResponse(text)
      const botMsg = {
        id: Date.now() + 1,
        text: responseText,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, botMsg])
      setIsTyping(false)
    }, 1000)
  }

  const getAIResponse = (query) => {
    const q = query.toLowerCase()
    
    // Core analytical logic
    if (q.includes("block a") || q.includes("cse")) {
      return "Analyzing campus layout... Block A (CSE) is currently at 42% occupancy. Optimal entry is via the North Gate. Would you like me to reserve a study slot?"
    }
    if (q.includes("energy") || q.includes("saving") || q.includes("bill")) {
      return `Fetching live utility data... We've saved approximately ₹4,200 in energy costs today. The HVAC optimization in Block B was the biggest contributor. View full report in 'Energy Opt'.`
    }
    if (q.includes("study") || q.includes("quiet") || q.includes("place")) {
      const topZone = state.rooms.find(r => r.status === 'free')
      return `Scanning for quiet zones... I recommend ${topZone?.code || 'A-207'}. It has a Focus Score of 94% and current noise levels are below 30dB. Just clicked 'NAV-R' to see the path.`
    }
    if (q.includes("iot") || q.includes("sensor") || q.includes("status")) {
      return "Checking sensor mesh network... 28/30 sensors are responding. Sensor PSTM-TEMP-1012 in Block C is showing high latency. I've logged this for IT Admin."
    }
    if (q.includes("maintenance") || q.includes("repair") || q.includes("fix")) {
      return "Opening maintenance ticket system... Please describe the issue. I can automatically categorize it as 'Electrical', 'HVAC', or 'Plumbing' for faster resolution."
    }
    if (q.includes("who") || q.includes("creator") || q.includes("autopilot")) {
      return "I am the PESITM Campus Autopilot Assistant, powered by a Digital Twin of the Shivamogga campus to optimize resource usage and user comfort 24/7."
    }

    return "Analyzing your request... I don't have a specific answer for that in my local campus database yet, but I can help you with Navigation, IoT status, or Energy analytics. Try asking 'Where is Block A?' or 'How is the air quality?'"
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300 border border-gray-100">
          {/* Header */}
          <div className="bg-navy p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange flex items-center justify-center text-white">
                <Bot size={22} />
              </div>
              <div>
                <p className="text-body font-bold text-white leading-none">Campus Assistant</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] text-white/60 uppercase font-bold tracking-widest">Always Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white p-1">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-page/30">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-body shadow-sm ${
                  m.sender === 'user' 
                    ? 'bg-orange text-white rounded-tr-none' 
                    : 'bg-white text-navy border border-gray-100 rounded-tl-none'
                }`}>
                  <p>{m.text}</p>
                  <p className={`text-[10px] mt-1 ${m.sender === 'user' ? 'text-white/70' : 'text-textmute'}`}>
                    {m.time}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-textmute rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                    <span className="w-1.5 h-1.5 bg-textmute rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
                    <span className="w-1.5 h-1.5 bg-textmute rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Replies */}
          <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar border-t border-gray-50 bg-white">
            {["Find Room", "Energy Info", "Report Issue"].map(btn => (
              <button 
                key={btn}
                onClick={() => handleSend(btn)}
                className="whitespace-nowrap px-3 py-1 bg-page text-textmute rounded-full text-label border border-gray-100 hover:border-orange/30 hover:text-orange transition-all"
              >
                {btn}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
            <input 
              className="flex-1 h-10 px-4 bg-page rounded-pill text-body focus:outline-none focus:ring-1 focus:ring-orange"
              placeholder="Ask me anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={() => handleSend()}
              className="w-10 h-10 bg-orange text-white rounded-full flex items-center justify-center hover:bg-orange/90 shadow-lg transition-transform active:scale-95"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-90 ${
          isOpen ? 'bg-white text-navy rotate-90' : 'bg-orange text-white hover:scale-110'
        }`}
      >
        {isOpen ? <X size={28} /> : (
          <div className="relative">
            <MessageSquare size={28} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-orange rounded-full" />
          </div>
        )}
      </button>
    </div>
  )
}
