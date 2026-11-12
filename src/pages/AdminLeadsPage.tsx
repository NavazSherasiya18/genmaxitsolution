import React, { useState, useEffect } from 'react';
import { Download, FileSpreadsheet, Mail, Phone, Calendar, ShieldCheck, RefreshCw, User, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LeadRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  createdAt: string;
  formattedDate: string;
}

interface EmailLogRecord {
  id: string;
  leadId: string;
  to: string;
  subject: string;
  sentAt: string;
  status: 'sent' | 'logged';
  details: any;
}

export const AdminLeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLogRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'leads' | 'emails'>('leads');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [leadsRes, emailRes] = await Promise.all([
        fetch('/api/leads'),
        fetch('/api/admin/email-logs'),
      ]);

      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        setLeads(leadsData.leads || []);
      }

      if (emailRes.ok) {
        const emailData = await emailRes.json();
        setEmailLogs(emailData.logs || []);
      }
    } catch (err) {
      console.error('Failed to load admin leads data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDownloadExcel = () => {
    window.location.href = '/api/leads/export';
  };

  const filteredLeads = leads.filter((lead) => {
    const q = searchQuery.toLowerCase();
    return (
      lead.name.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      lead.phone.toLowerCase().includes(q)
    );
  });

  return (
    <div className="pt-28 pb-20 min-h-screen bg-[#F8FAFC] dark:bg-[#0B1020] text-slate-800 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Website</span>
          </Link>

          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            🔒 Company Management Portal
          </span>
        </div>

        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold font-heading text-slate-900 dark:text-white tracking-tight">
              Client Leads & Verification Database
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Private company repository. Dispatched directly to <strong className="text-slate-900 dark:text-white">navazsherasiya0@gmail.com</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              title="Refresh leads data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            {/* Direct Excel Download Button for the Company Owner */}
            <button
              onClick={handleDownloadExcel}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download Excel (.CSV)</span>
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
              Total Captured Leads
            </div>
            <div className="text-3xl font-bold font-heading text-slate-900 dark:text-white">
              {leads.length}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              All unique verified contacts
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              Duplicate Protection
            </div>
            <div className="text-3xl font-bold font-heading text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <ShieldCheck className="w-7 h-7" />
              <span>100% Enforced</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              1 email ID allowed only 1 entry
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
              Email Notifications
            </div>
            <div className="text-3xl font-bold font-heading text-cyan-600 dark:text-cyan-400">
              {emailLogs.length} Dispatched
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              Target: navazsherasiya0@gmail.com
            </div>
          </div>
        </div>

        {/* Tab Switcher & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800">
            <button
              onClick={() => setActiveTab('leads')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'leads'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Verified Leads ({leads.length})
            </button>
            <button
              onClick={() => setActiveTab('emails')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'emails'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Email Dispatch Logs ({emailLogs.length})
            </button>
          </div>

          {activeTab === 'leads' && (
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-80 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          )}
        </div>

        {/* Content View */}
        {activeTab === 'leads' ? (
          <div className="rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-4">#</th>
                    <th className="py-3.5 px-4">Client Name</th>
                    <th className="py-3.5 px-4">Email Address</th>
                    <th className="py-3.5 px-4">Phone / WhatsApp</th>
                    <th className="py-3.5 px-4">Submission Date</th>
                    <th className="py-3.5 px-4 text-right">Instant Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        Loading lead data...
                      </td>
                    </tr>
                  ) : filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        No leads found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead, idx) => (
                      <tr key={lead.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                          {lead.name}
                        </td>
                        <td className="py-3.5 px-4 text-indigo-600 dark:text-cyan-400 font-medium">
                          <a href={`mailto:${lead.email}`} className="hover:underline">
                            {lead.email}
                          </a>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-800 dark:text-slate-200">
                          {lead.phone}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                          {lead.formattedDate}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-semibold text-[11px] hover:bg-emerald-100 transition-colors"
                          >
                            WhatsApp
                          </a>
                          <a
                            href={`tel:${lead.phone.replace(/\s+/g, '')}`}
                            className="inline-flex items-center px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-cyan-300 border border-indigo-200 dark:border-indigo-500/20 font-semibold text-[11px] hover:bg-indigo-100 transition-colors"
                          >
                            Call
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Email Dispatch Logs */
          <div className="rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">
              Outgoing Email Dispatch Records
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Each lead submitted via the 5-second verification popup automatically generates an email dispatch for the company inbox.
            </p>

            <div className="space-y-3 pt-2">
              {emailLogs.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">No email dispatch logs yet.</div>
              ) : (
                emailLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Mail className="w-4 h-4 text-indigo-500" />
                        <span>{log.subject}</span>
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 mt-1">
                        Recipient: <strong className="text-slate-700 dark:text-slate-300">{log.to}</strong> • Client: {log.details?.leadName} ({log.details?.leadPhone})
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                        {log.status === 'sent' ? 'Dispatched via SMTP' : 'Queued / Logged'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(log.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
