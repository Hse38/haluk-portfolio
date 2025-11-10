import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(bodyParser.json());
app.use(express.static(__dirname)); // tüm dosyaları (index.html, js, css, data vs.) sunar

// 🧠 Konuşma geçmişi (hafıza)
let chatHistory = [];

// === Chat endpoint ===
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: "Mesaj boş olamaz." });
    }

    // Kullanıcının mesajını geçmişe ekle
    chatHistory.push({ role: "user", content: userMessage });

    // OpenAI çağrısı
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
            role: "system",
            content: `
            Sen Haluk Şakir Ekinci’nin portföy sitesinde yer alan resmi yapay zekâ asistanısın.
            Görevin, site ziyaretçilerine Haluk'un kim olduğunu, neler yaptığını ve uzmanlık alanlarını doğru, açık ve profesyonel biçimde anlatmaktır.
            Haluk Şakir Ekinci, T3 Vakfı’nda ERP sistemleri ve dijital dönüşüm projeleri üzerine çalışan bir yazılım geliştiricisidir.
            ERP, süreç otomasyonu, Flutter, Django, Python, App Script, PostgreSQL gibi teknolojilerde uzmandır.
            Ziyaretçi sana “ne iş yapıyorsun” veya “ERP nedir” gibi sorular sorduğunda, Haluk’un yaptığı işleri sade ama profesyonel biçimde anlat.
            Yanıtlarda gereksiz detay, saçmalama veya konu dışı ifadelerden kaçın.
            Her yanıtın kısa (1-2 cümle), akıcı ve güven veren bir tonda olsun.
            `
        },
        ...chatHistory,
      ],
      temperature: 0.3,
    });

    const reply = completion.choices[0].message.content;

    // Asistan cevabını da geçmişe ekle
    chatHistory.push({ role: "assistant", content: reply });

    res.json({ reply });
  } catch (err) {
    console.error("API hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// 💬 Sohbet geçmişini sıfırlamak için endpoint (isteğe bağlı)
app.post("/api/reset", (req, res) => {
  chatHistory = [];
  res.json({ status: "ok", message: "Sohbet geçmişi sıfırlandı." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Sunucu ${PORT} portunda çalışıyor...`));
