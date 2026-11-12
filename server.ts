import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leads & Email dispatches storage paths
const LEADS_FILE = path.resolve(__dirname, 'data', 'leads.json');
const EMAIL_LOG_FILE = path.resolve(__dirname, 'data', 'email_dispatches.json');

interface LeadRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  createdAt: string;
  formattedDate: string;
}

interface EmailDispatchRecord {
  id: string;
  leadId: string;
  to: string;
  subject: string;
  sentAt: string;
  status: 'sent' | 'logged';
  details: any;
}

function getStoredLeads(): LeadRecord[] {
  try {
    const dir = path.dirname(LEADS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(LEADS_FILE)) {
      const initialSeed: LeadRecord[] = [
        {
          id: 'lead-seed-1',
          name: 'Rohit Sharma',
          email: 'rohit.sharma@example.com',
          phone: '+91 99383 07637',
          source: 'Website Verify Popup',
          createdAt: new Date().toISOString(),
          formattedDate: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        },
      ];
      fs.writeFileSync(LEADS_FILE, JSON.stringify(initialSeed, null, 2), 'utf-8');
      return initialSeed;
    }
    const content = fs.readFileSync(LEADS_FILE, 'utf-8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.error('Error reading leads:', err);
    return [];
  }
}

function saveStoredLeads(leads: LeadRecord[]) {
  try {
    const dir = path.dirname(LEADS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving leads:', err);
  }
}

function logEmailDispatch(record: EmailDispatchRecord) {
  try {
    const dir = path.dirname(EMAIL_LOG_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const current: EmailDispatchRecord[] = fs.existsSync(EMAIL_LOG_FILE)
      ? JSON.parse(fs.readFileSync(EMAIL_LOG_FILE, 'utf-8') || '[]')
      : [];
    current.unshift(record);
    fs.writeFileSync(EMAIL_LOG_FILE, JSON.stringify(current, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error logging email dispatch:', err);
  }
}

async function sendOwnerEmailNotification(lead: LeadRecord): Promise<{ success: boolean; status: 'sent' | 'logged' }> {
  const recipient = process.env.OWNER_EMAIL || 'navazsherasiya0@gmail.com';
  const subject = `🚀 New Lead Verified: ${lead.name} (${lead.phone}) - Genmax IT Solution`;

  const htmlBody = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 620px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff;">
      <div style="background: linear-gradient(100deg, #4f46e5, #0891b2); padding: 20px 24px; border-radius: 12px; color: #ffffff;">
        <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.9; font-weight: bold;">Genmax IT Solution • Lead Desk</span>
        <h2 style="margin: 6px 0 0 0; font-size: 22px; font-weight: bold;">New Client Details Verified</h2>
      </div>

      <div style="padding: 24px 0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 0; color: #64748b; font-weight: 600; width: 140px;">Client Name:</td>
            <td style="padding: 12px 0; color: #0f172a; font-weight: bold; font-size: 16px;">${lead.name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 0; color: #64748b; font-weight: 600;">Email Address:</td>
            <td style="padding: 12px 0; color: #4f46e5; font-weight: 600;">
              <a href="mailto:${lead.email}" style="color: #4f46e5; text-decoration: none;">${lead.email}</a>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 0; color: #64748b; font-weight: 600;">Phone / WhatsApp:</td>
            <td style="padding: 12px 0; color: #0f172a; font-weight: bold;">
              <a href="tel:${lead.phone.replace(/\s+/g, '')}" style="color: #0891b2; text-decoration: none;">${lead.phone}</a>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 0; color: #64748b; font-weight: 600;">Submission Time:</td>
            <td style="padding: 12px 0; color: #334155;">${lead.formattedDate}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #64748b; font-weight: 600;">Source:</td>
            <td style="padding: 12px 0; color: #334155;">${lead.source}</td>
          </tr>
        </table>
      </div>

      <div style="background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; text-align: center;">
        <a href="https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}" style="display: inline-block; background: #10b981; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px; margin-right: 12px;">Instant WhatsApp Chat</a>
        <a href="tel:${lead.phone.replace(/\s+/g, '')}" style="display: inline-block; background: #4f46e5; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px;">Call Now</a>
      </div>

      <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
        Dispatched automatically to ${recipient} • Genmax IT Solution Lead Routing
      </div>
    </div>
  `;

  // If SMTP is provided, send email via nodemailer
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Genmax IT Solution" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: recipient,
        cc: 'info@genmaxitsolution.com',
        subject,
        html: htmlBody,
      });

      logEmailDispatch({
        id: `email-${Date.now()}`,
        leadId: lead.id,
        to: recipient,
        subject,
        sentAt: new Date().toISOString(),
        status: 'sent',
        details: { leadName: lead.name, leadEmail: lead.email, leadPhone: lead.phone },
      });

      return { success: true, status: 'sent' };
    } catch (smtpErr) {
      console.warn('SMTP delivery notice, falling back to dispatch log:', smtpErr);
    }
  }

  // Always log dispatch in database so company owner never loses any email notifications
  logEmailDispatch({
    id: `email-${Date.now()}`,
    leadId: lead.id,
    to: recipient,
    subject,
    sentAt: new Date().toISOString(),
    status: 'logged',
    details: { leadName: lead.name, leadEmail: lead.email, leadPhone: lead.phone },
  });

  console.log(`[EMAIL DISPATCH] Lead notification generated for owner (${recipient}):`, {
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    time: lead.formattedDate,
  });

  return { success: true, status: 'logged' };
}

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

  // Leads endpoints with strict unique email validation & Excel CSV export
  app.get('/api/leads', (_req, res) => {
    const leads = getStoredLeads();
    res.json({
      success: true,
      count: leads.length,
      leads,
    });
  });

    app.post('/api/leads', async (req, res) => {
    try {
      const { name, email, phone, source } = req.body;

      if (!name || !name.trim()) {
        res.status(400).json({ success: false, error: 'Full name is required.' });
        return;
      }

      if (!email || !email.trim() || !email.includes('@')) {
        res.status(400).json({ success: false, error: 'A valid email address is required.' });
        return;
      }

      if (!phone || !phone.trim()) {
        res.status(400).json({ success: false, error: 'Phone number is required.' });
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();
      const currentLeads = getStoredLeads();

      // Enforce: 1 email id can only be submitted once; reject duplicates
      const isDuplicate = currentLeads.some(
        (lead) => lead.email.trim().toLowerCase() === normalizedEmail
      );

      if (isDuplicate) {
        res.status(409).json({
          success: false,
          duplicate: true,
          error: 'This Email ID has already been registered! Duplicate entries are not allowed.',
        });
        return;
      }

      const now = new Date();
      const newLead: LeadRecord = {
        id: `lead-${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        phone: phone.trim(),
        source: source || 'Verify Your Details Popup',
        createdAt: now.toISOString(),
        formattedDate: now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      };

      currentLeads.unshift(newLead);
      saveStoredLeads(currentLeads);

      // Instantly dispatch email notification to the company owner
      const emailResult = await sendOwnerEmailNotification(newLead);

      res.status(201).json({
        success: true,
        message: 'Details verified and saved successfully. Notification sent to company desk.',
        lead: newLead,
        totalLeads: currentLeads.length,
        emailNotification: emailResult,
      });
    } catch (err: any) {
      console.error('Error creating lead:', err);
      res.status(500).json({
        success: false,
        error: 'Failed to save details.',
        details: err?.message,
      });
    }
  });

  // Dispatched email notification logs for company owner
  app.get('/api/admin/email-logs', (_req, res) => {
    try {
      const logs = fs.existsSync(EMAIL_LOG_FILE)
        ? JSON.parse(fs.readFileSync(EMAIL_LOG_FILE, 'utf-8') || '[]')
        : [];
      res.json({ success: true, count: logs.length, logs });
    } catch {
      res.json({ success: true, count: 0, logs: [] });
    }
  });

  // Export leads as Excel-compatible CSV file (with UTF-8 BOM)
  app.get('/api/leads/export', (_req, res) => {
    try {
      const leads = getStoredLeads();
      const escapeCsv = (str: any) => `"${String(str || '').replace(/"/g, '""')}"`;

      const headers = [
        'Lead ID',
        'Full Name',
        'Email Address',
        'Phone Number',
        'Source / Campaign',
        'Submission Date & Time (IST)',
      ];

      const rows = leads.map((l) => [
        escapeCsv(l.id),
        escapeCsv(l.name),
        escapeCsv(l.email),
        escapeCsv(l.phone),
        escapeCsv(l.source),
        escapeCsv(l.formattedDate || l.createdAt),
      ].join(','));

      // Include UTF-8 BOM (\uFEFF) so Microsoft Excel opens it directly with correct characters
      const csvOutput = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="genmax_leads_${new Date().toISOString().slice(0, 10)}.csv"`
      );
      res.send(csvOutput);
    } catch (err: any) {
      console.error('Error exporting leads:', err);
      res.status(500).send('Error generating export file.');
    }
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
