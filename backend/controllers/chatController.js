const Groq = require('groq-sdk');
require('dotenv').config();

// Fallback logic for when Groq API key is missing or request fails
const getFallbackResponse = (message) => {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('apa itu') || lowerMsg.includes('what is')) {
    return "ScoreKu adalah sistem pemarkahan kredit alternatif yang menggunakan data e-dompet, bil dan sejarah digital untuk membantu anda membina profil kewangan.";
  }
  if (lowerMsg.includes('ctos') || lowerMsg.includes('ccris')) {
    return "Tidak seperti CTOS/CCRIS yang bergantung pada pinjaman bank, ScoreKu menggunakan data alternatif. Ini bermakna individu tanpa sejarah pinjaman bank juga boleh mendapat skor kredit yang baik.";
  }
  if (lowerMsg.includes('naikkan') || lowerMsg.includes('improve')) {
    return "Untuk menaikkan skor anda: 1) Bayar bil tepat pada masanya, 2) Gunakan e-dompet (DuitNow) dengan kerap, 3) Kurangkan kadar pulangan e-dagang anda.";
  }
  if (lowerMsg.includes('selamat') || lowerMsg.includes('safe') || lowerMsg.includes('security')) {
    return "Ya, data anda selamat. Kami menggunakan enkripsi 256-bit gred bank dan mematuhi PDPA. Kami tidak pernah menjual data peribadi anda.";
  }
  
  return "Maaf, saya tak faham soalan tu. Boleh tanya saya tentang cara ScoreKu berfungsi, cara naikkan skor, atau perbandingan dengan CTOS/CCRIS.";
};

const chatWithAI = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if API key exists
    if (!process.env.GROQ_API_KEY) {
      console.warn("GROQ_API_KEY is not set. Using offline fallback responses.");
      return res.json({ 
        response: getFallbackResponse(message),
        model: 'offline-fallback'
      });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    // Format history for Groq
    const messages = [
      {
        role: 'system',
        content: `You are ScoreKu AI, an intelligent credit score assistant for Malaysians. 
ScoreKu is an alternative credit scoring app that uses e-wallet, DuitNow, and digital footprint data (not just bank loans like CTOS/CCRIS).

Rules:
1. Speak in friendly Malaysian style (Manglish/BM/English mixture).
2. Give CONCISE but PRECISE answers. Avoid overly long paragraphs, but DO NOT skip important details. Use short bullet points.
3. If asked for a guide/how-to, list maximum 3-4 simple steps.
4. Core features of ScoreKu you must know (from Sidebar):
   - "Dashboard": Main overview of score, percentile, trend chart, and risk status.
   - "Kira Skor" (Score Form): 4-step form (Income, E-wallet, Bills, Digital) to generate score.
   - "Score History": View past score trends and changes over time.
   - "Sambung Bank" (Connect Bank): Link bank accounts securely for automatic data import.
   - "Bandingkan" (Compare): Compare your score vs national average, age, and job type.
   - "Marketplace": View and apply for financial products (loans, credit cards) you are eligible for based on your ScoreKu score.
   - "Simulator": A "What-If" tool to predict score changes if you change financial habits.
   - "Transactions": History of all digital transactions that affect your score.
   - "Report": Detailed monthly financial and score report.
   - "Belajar" (Learn): Articles and hub to improve financial literacy.
   - "Referral": Invite friends program to earn bonus points.
5. If asked about improving scores, give 3 precise tips (e.g. 1. Pay bills on time, 2. Use DuitNow consistently, 3. Stable income).
6. You are an AI created by ScoreKu.`
      },
      ...history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text || ''
      })),
      { role: 'user', content: message }
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.3-70b-versatile", // Latest Groq model
      temperature: 0.7,
      max_tokens: 1000,
    });

    res.json({
      response: chatCompletion.choices[0]?.message?.content || getFallbackResponse(message),
      model: "llama-3.3-70b-versatile"
    });

  } catch (error) {
    console.error('Groq AI Error:', error);
    
    // Check if it's an API key issue
    if (error.message && error.message.includes('api_key')) {
      return res.json({ 
        response: "Masalah konfigurasi API Key (Groq). Sila periksa Render Environment Variables.",
        model: 'error-api-key'
      });
    }

    res.json({ 
      // Return the actual error message for debugging
      response: `AI Error: ${error.message}. Fallback: ${getFallbackResponse(req.body.message || "")}`,
      model: 'offline-fallback-error'
    });
  }
};

module.exports = {
  chatWithAI
};