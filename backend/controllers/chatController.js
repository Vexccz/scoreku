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
2. Keep answers short, direct, and helpful (max 3 sentences).
3. If asked about improving scores, suggest paying bills, using DuitNow, and maintaining stable income.
4. You are an AI created by ScoreKu.`
      },
      ...history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      { role: 'user', content: message }
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "llama3-8b-8192", // Fast model
      temperature: 0.5,
      max_tokens: 150,
    });

    res.json({
      response: chatCompletion.choices[0]?.message?.content || getFallbackResponse(message),
      model: "llama3-8b-8192"
    });

  } catch (error) {
    console.error('Groq AI Error:', error.message);
    res.json({ 
      response: getFallbackResponse(req.body.message || ""),
      model: 'offline-fallback-error'
    });
  }
};

module.exports = {
  chatWithAI
};