import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      agency: 'Genmax IT Solution',
      service: 'Digital Marketing & IT Engineering Agency',
      location: 'Noida, Delhi NCR, India',
    });
  });

  // Maps config endpoint
  app.get('/api/maps-config', (_req, res) => {
    res.json({
      apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '',
      defaultCenter: { lat: 28.5521, lng: 77.3486 },
      address: 'C3M Aneja Market, Sadarpur, Sector-45, Noida, Delhi NCR, India - 201301',
    });
  });

  // Server-side Gemini AI Chatbot endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'A valid message string is required.' });
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Fallback response with accurate agency details if API key is not configured in local environment
        res.json({
          reply: `Hello! I am the Genmax IT Solution AI Consultant. 

We are an Indian IT engineering and digital marketing agency based in Noida, Delhi NCR (C3M Aneja Market, Sadarpur, Sec-45, Noida 201301).

Here is how we can help your business:
• **SEO & Search Dominance**: Local SEO & Google Maps 3-Pack, eCommerce SEO, White-Hat link building, Technical SEO audits, and penalty recovery.
• **Web & Software Development**: High-performance WordPress, WooCommerce, custom Laravel, CodeIgniter, Matx, and React/Next.js architectures.
• **Mobile App Development**: Native & cross-platform iOS & Android engineering.
• **Agile Guarantees**: 7–14 business day turnarounds, 365 days of free technical support, and free domain registration (worth ₹999) on all standard packages.
• **Transparent Pricing**: Starter (₹12,999), Professional (₹29,999), and Enterprise (₹59,999).

Would you like to schedule your **Free 25-Point SEO & Website Audit**, or connect directly with our Noida engineers on WhatsApp at **+91 99383 07637**?`,
        });
        return;
      }

      const ai = new GoogleGenAI({
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      // Prepare multi-turn history
      const formattedHistory = Array.isArray(history)
        ? history.slice(-10).map((msg: { role: string; text: string }) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }],
          }))
        : [];

      const chat = ai.chats.create({
        model: 'gemini-3.8-flash',
        config: {
          systemInstruction: `You are the senior technical consultant and AI assistant for Genmax IT Solution (https://genmaxitsolution.com), an elite digital engineering firm and SEO agency headquartered in Noida, Delhi NCR, India.

Headquarters & Contact Details:
- Address: C3M Aneja Market, Sadarpur, Sector-45, Noida, Delhi NCR, India - 201301
- Phone / WhatsApp: +91 99383 07637
- Email: info@genmaxitsolution.com
- Hours: Mon - Sat: 9:30 AM – 7:00 PM IST

Core Services:
1. SEO & Digital Marketing: Local SEO, Google Maps 3-Pack ranking, eCommerce SEO, 100% White-Hat on-page and off-page optimization, Google algorithm penalty recovery, Social Media Marketing, PPC Google Ads management, and online reputation management.
2. Web & E-commerce Engineering: High-performance Website Design India, WordPress development, WooCommerce store design, responsive UI/UX, website redesign, and speed optimization.
3. Custom Software & Frameworks: Laravel development, CodeIgniter development, Matx development, REST APIs, and database engineering.
4. Mobile App Engineering: Native and cross-platform iOS & Android mobile application development.

Key Agency Guarantees & Values:
- 7 to 14 business day agile delivery for standard projects.
- 365 days of complimentary post-launch technical support with every project.
- Free domain registration worth ₹999 on standard website packages.
- 100% White-Hat methodology: zero black-hat tactics, strict adherence to Google Webmaster Guidelines.
- Transparent, fixed-price packages: Starter (₹12,999), Professional (₹29,999), Enterprise (₹59,999).
- Free 25-point SEO & Website Audit covering technical crawlability, Core Web Vitals, and backlink health.

Conversation Guidelines:
- Be authoritative, helpful, clear, and professional.
- Keep responses well-structured with concise bullet points and bold headers when helpful.
- Suggest next steps such as requesting the Free SEO Audit report or reaching out directly on WhatsApp at +91 99383 07637.
- If asked about location or visits, confirm the Noida Sector-45 office and offer directions or meeting scheduling.`,
        },
        history: formattedHistory,
      });

      const response = await chat.sendMessage({
        message,
      });

      res.json({
        reply: response.text || 'Thank you for reaching out to Genmax IT Solution. How can we assist you with your project today?',
      });
    } catch (err: any) {
      console.warn('Gemini chat upstream notice:', err?.message || err);
      // Return helpful fallback response if model experiences a temporary capacity spike
      res.json({
        reply: `Thank you for contacting **Genmax IT Solution**! 

We are an Indian IT engineering and digital marketing agency based in **Noida, Delhi NCR** (C3M Aneja Market, Sadarpur, Sec-45, Noida 201301).

Our Core Offerings:
• **Local & Enterprise SEO**: 100% White-Hat optimization, Google Maps 3-Pack, penalty recovery, and eCommerce SEO.
• **Web & Custom Software**: Modern WordPress, WooCommerce, custom Laravel, CodeIgniter, Matx, and high-speed responsive web applications.
• **Mobile App Development**: Native & hybrid iOS and Android development.
• **Agency Guarantees**: 7–14 business day agile delivery, 365 days of free post-launch support, and free domain registration worth ₹999.
• **Transparent Pricing**: Starter (₹12,999), Professional (₹29,999), and Enterprise (₹59,999).

You can claim your **Free 25-Point SEO & Website Audit** anytime, or connect directly with our Noida leadership on WhatsApp at **+91 99383 07637**.`,
      });
    }
  });

  // Production static file serving vs Development Vite middleware
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Genmax IT Solution full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
