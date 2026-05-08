import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Brain } from 'lucide-react'

const knowledgeBase = [
  {
    patterns: ['apa itu scoreku', 'what is scoreku', 'scoreku apa', 'apa scoreku'],
    response: 'ScoreKu adalah platform pemarkahan kredit alternatif yang menggunakan AI untuk menjana skor kredit bagi rakyat Malaysia yang tiada sejarah kredit tradisional (CCRIS/CTOS). Kami menggunakan data seperti transaksi e-dompet, pembayaran bil, dan aktiviti digital.'
  },
  {
    patterns: ['macam mana skor dikira', 'how score calculated', 'cara kira skor', 'score calculate', 'how is score'],
    response: 'Skor anda dikira menggunakan model XGBoost yang dilatih pada 10,000+ profil. 56 ciri dianalisis termasuk: kestabilan pendapatan, konsistensi pembayaran bil, aktiviti e-dompet, dan jejak digital. Skor dalam julat 300-850 (format CTOS).'
  },
  {
    patterns: ['apa itu shap', 'what is shap', 'shap'],
    response: 'SHAP (SHapley Additive exPlanations) adalah teknik AI yang menjelaskan KENAPA skor anda begitu. Ia menunjukkan faktor mana yang membantu (+) dan menjejaskan (-) skor anda, supaya anda tahu apa yang perlu diperbaiki.'
  },
  {
    patterns: ['macam mana nak improve', 'how to improve', 'cara improve', 'tingkatkan skor', 'naikkan skor', 'improve score'],
    response: 'Cara terbaik: 1) Bayar bil tepat masa setiap bulan (+55 mata), 2) Gunakan DuitNow/e-dompet secara konsisten (+40 mata), 3) Kekalkan pendapatan stabil 6 bulan (+70 mata), 4) Kurangkan pulangan e-commerce (+25 mata).'
  },
  {
    patterns: ['data apa yang dikumpul', 'what data', 'data apa', 'kumpul data'],
    response: 'Kami mengumpul: pendapatan bulanan, jenis pekerjaan, transaksi e-dompet/DuitNow, rekod pembayaran bil utiliti, sejarah sewa, pesanan e-commerce, dan top-up mobile. Semua data dienkripsi dan tidak dikongsi.'
  },
  {
    patterns: ['adakah selamat', 'is it safe', 'privacy', 'selamat ke', 'secure', 'keselamatan'],
    response: 'Ya! Data anda dilindungi dengan enkripsi 256-bit, mematuhi PDPA Malaysia, dan tidak pernah dikongsi dengan pihak ketiga. Kami hanya menggunakan data untuk mengira skor anda.'
  },
  {
    patterns: ['apa produk yang boleh mohon', 'eligible products', 'produk layak', 'boleh mohon apa', 'loan apa'],
    response: 'Bergantung pada skor anda: 720+ (BSN Micro Loan, SME Bank), 650+ (TEKUN Nasional, MARA), 530+ (Amanah Ikhtiar), 450+ (PTPTN). Semakin tinggi skor, semakin banyak pilihan.'
  },
  {
    patterns: ['berapa lama', 'how long', 'masa berapa'],
    response: 'Proses pengiraan skor mengambil masa kurang dari 2 minit. Isi borang 4 langkah, AI proses, dan skor anda sedia!'
  },
  {
    patterns: ['percuma ke', 'is it free', 'free ke', 'bayar ke', 'harga'],
    response: 'Ya, ScoreKu percuma sepenuhnya! Ini adalah projek FYP di UMPSA yang dibina untuk rangkuman kewangan.'
  },
  {
    patterns: ['beza dengan ctos', 'difference ctos', 'ctos', 'beza ctos'],
    response: 'CTOS hanya boleh skor orang yang ada sejarah bank (pinjaman, kad kredit). ScoreKu menggunakan data ALTERNATIF (e-dompet, bil, digital) untuk orang yang CTOS tidak boleh skor. Kami melengkapi CTOS, bukan menggantikannya.'
  },
  {
    patterns: ['connect bank', 'sambung bank', 'link bank', 'hubung bank'],
    response: "Anda boleh sambungkan akaun bank untuk pemarkahan automatik. Pergi ke halaman 'Sambung Bank', pilih bank anda, authorize akses baca-sahaja, dan sistem akan import data transaksi secara automatik."
  },
  {
    patterns: ['simulator', 'simulasi', 'what if', 'what-if'],
    response: "Simulator 'What-If' membolehkan anda lihat bagaimana skor berubah jika anda mengubah tabiat kewangan. Contoh: 'Jika saya bayar semua bil tepat masa 3 bulan, skor naik +55 mata'."
  },
]

const defaultResponse = 'Maaf, saya tidak pasti tentang soalan itu. Cuba tanya tentang: cara skor dikira, cara improve skor, keselamatan data, produk yang layak, atau cara sambung bank. Atau layari halaman FAQ kami!'

function findResponse(userInput) {
  const lower = userInput.toLowerCase().trim()
  for (const entry of knowledgeBase) {
    for (const pattern of entry.patterns) {
      if (lower.includes(pattern)) {
        return entry.response
      }
    }
  }
  return defaultResponse
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-gray-400 rounded-full"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  )
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const location = useLocation()

  const isHidden = location.pathname === '/' || location.pathname === '/welcome'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleOpen = () => {
    setIsOpen(true)
    if (!hasOpened) {
      setHasOpened(true)
      setMessages([
        {
          id: 'welcome',
          role: 'bot',
          text: 'Hai! \u{1F44B} Saya pembantu AI ScoreKu. Tanya saya apa-apa tentang skor kredit, ciri-ciri platform, atau cara meningkatkan skor anda!',
        },
      ])
    }
  }

  const handleSend = (text) => {
    const msg = text || input.trim()
    if (!msg) return

    const userMsg = { id: Date.now().toString(), role: 'user', text: msg }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    const delay = 800 + Math.random() * 400
    setTimeout(() => {
      const response = findResponse(msg)
      const botMsg = { id: (Date.now() + 1).toString(), role: 'bot', text: response }
      setMessages((prev) => [...prev, botMsg])
      setIsTyping(false)
    }, delay)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickReplies = ['Apa itu ScoreKu?', 'Cara improve skor', 'Adakah selamat?']

  if (isHidden) return null

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={handleOpen}
            className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-[100] w-[350px] h-[500px] max-sm:w-full max-sm:h-full max-sm:bottom-0 max-sm:right-0 max-sm:rounded-none bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f1f1f]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">ScoreKu AI</p>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-xs text-gray-400">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[#1f1f1f] flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#1a1a1a] border border-[#2a2a2a] text-gray-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Quick replies after welcome */}
              {messages.length === 1 && messages[0].id === 'welcome' && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {quickReplies.map((qr) => (
                    <button
                      key={qr}
                      onClick={() => handleSend(qr)}
                      className="px-3 py-1.5 text-xs rounded-full border border-[#2a2a2a] text-gray-300 hover:bg-[#1a1a1a] transition-colors"
                    >
                      {qr}
                    </button>
                  ))}
                </div>
              )}

              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-[#1f1f1f]">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Tanya apa-apa..."
                  className="flex-1 bg-[#111] border border-[#1f1f1f] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500/50 transition-colors"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 flex items-center justify-center transition-colors"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
