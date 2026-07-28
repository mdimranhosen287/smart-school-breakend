/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Mail, 
  Trash2, 
  Check, 
  ChevronRight, 
  X, 
  Send, 
  Reply, 
  Clock, 
  User, 
  Inbox,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: number;
  sender: string;
  subject: string;
  date: string;
  excerpt: string;
  content: string;
  read: boolean;
}

interface AdminMailboxProps {
  messages: Message[];
  lang: 'bn' | 'en';
  onClose: () => void;
}

export default function AdminMailbox({ messages: initialMessages, lang, onClose }: AdminMailboxProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(initialMessages[0] || null);
  const [replyText, setReplyText] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const t = {
    en: {
      mailboxTitle: "Administrative Mailbox",
      mailboxDesc: "Read inbound support queries, parents inquiries, and school automated alerts",
      noMessages: "Your Inbox is Empty",
      noMessagesDesc: "You have resolved all school communication tickets.",
      replyLabel: "Draft Response",
      replyPlaceholder: "Type your official response here...",
      sendReply: "Send Response",
      deleteMsg: "Delete Thread",
      markRead: "Mark as Read",
      markUnread: "Mark as Unread",
      sender: "Sender",
      subject: "Subject",
      date: "Received At",
      replySuccess: "Response successfully delivered! Parents/Staff notified.",
      selectToRead: "Select a message from the list to read details"
    },
    bn: {
      mailboxTitle: "অ্যাডমিনিস্ট্রেটিভ মেইলবক্স",
      mailboxDesc: "অভিভাবকদের প্রশ্নাবলী, অভ্যন্তরীণ তথ্য এবং সিস্টেম নোটিফিকেশন চেক করুন",
      noMessages: "আপনার ইনবক্স সম্পূর্ণ খালি",
      noMessagesDesc: "সকল প্রকার যোগাযোগের টিকিট সমাধান করা হয়েছে।",
      replyLabel: "অফিসিয়াল জবাব লিখুন",
      replyPlaceholder: "আপনার উত্তর এখানে টাইপ করুন...",
      sendReply: "উত্তর পাঠান",
      deleteMsg: "মুছে ফেলুন",
      markRead: "পঠিত হিসেবে চিহ্নিত করুন",
      markUnread: "অপঠিত হিসেবে চিহ্নিত করুন",
      sender: "প্রেরক",
      subject: "বিষয়",
      date: "গ্রহণের সময়",
      replySuccess: "উত্তর সফলভাবে পাঠানো হয়েছে এবং সংশ্লিষ্ট পক্ষকে অবহিত করা হয়েছে।",
      selectToRead: "বিস্তারিত দেখতে বাম পাশের তালিকা থেকে একটি মেসেজ নির্বাচন করুন"
    }
  }[lang];

  const handleMarkReadToggle = (id: number) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: !m.read } : m));
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage(prev => prev ? { ...prev, read: !prev.read } : null);
    }
  };

  const handleDelete = (id: number) => {
    const updated = messages.filter(m => m.id !== id);
    setMessages(updated);
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage(updated[0] || null);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    // Simulate send reply
    setSuccessToast(t.replySuccess);
    setReplyText('');
    
    // Auto-mark read on reply
    if (selectedMessage) {
      setMessages(prev => prev.map(m => m.id === selectedMessage.id ? { ...m, read: true } : m));
      setSelectedMessage(prev => prev ? { ...prev, read: true } : null);
    }

    setTimeout(() => {
      setSuccessToast('');
    }, 4000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 15 }} 
      animate={{ opacity: 1, scale: 1, y: 0 }} 
      exit={{ opacity: 0, scale: 0.95, y: 15 }}
      className="bg-white rounded-3xl border border-gray-150 w-full max-w-4xl h-[600px] overflow-hidden shadow-2xl text-left flex flex-col font-sans"
    >
      {/* Header */}
      <div className="bg-[#005c53] text-white p-5 flex items-center justify-between shrink-0">
        <div className="space-y-0.5">
          <h4 className="font-extrabold text-base flex items-center gap-2">
            <Mail className="h-5 w-5 text-emerald-300" />
            <span>{t.mailboxTitle}</span>
          </h4>
          <p className="text-[10px] text-emerald-100/80 font-bold">
            {t.mailboxDesc}
          </p>
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-full text-white transition-colors cursor-pointer focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main Container Split */}
      <div className="grow flex overflow-hidden relative">
        {/* Success Toast */}
        <AnimatePresence>
          {successToast && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-5 py-3 rounded-2xl text-xs font-black shadow-lg z-50 flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              <span>{successToast}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {messages.length === 0 ? (
          <div className="grow flex flex-col items-center justify-center p-8 space-y-4 text-center">
            <div className="h-16 w-16 bg-gray-50 rounded-full border border-gray-150 flex items-center justify-center text-gray-400">
              <Inbox className="h-7 w-7" />
            </div>
            <div>
              <h5 className="font-black text-gray-800 text-sm">{t.noMessages}</h5>
              <p className="text-xs text-gray-400 font-bold max-w-xs mt-1">{t.noMessagesDesc}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Left sidebar - Messages List */}
            <div className="w-1/3 border-r border-gray-150 overflow-y-auto bg-slate-50/50">
              {messages.map(msg => {
                const isSelected = selectedMessage?.id === msg.id;
                return (
                  <button
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg)}
                    className={`w-full p-4 border-b border-gray-100 transition-all text-left block cursor-pointer focus:outline-none relative ${
                      isSelected ? 'bg-white shadow-3xs border-l-4 border-l-[#005c53]' : 'hover:bg-slate-50'
                    }`}
                  >
                    {!msg.read && (
                      <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-[#005c53]" />
                    )}
                    <h5 className={`text-xs truncate pr-3 ${!msg.read ? 'font-black text-gray-900' : 'font-bold text-gray-600'}`}>
                      {msg.sender}
                    </h5>
                    <p className={`text-[11px] truncate mt-1 ${!msg.read ? 'font-extrabold text-gray-800' : 'text-gray-400'}`}>
                      {msg.subject}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gray-400 font-bold">
                      <Clock className="h-3 w-3" />
                      <span>{msg.date}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right panel - Message Content & Reply form */}
            <div className="w-2/3 flex flex-col overflow-hidden bg-white">
              {selectedMessage ? (
                <div className="grow flex flex-col overflow-hidden">
                  {/* Subject and Actions Header */}
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between shrink-0 bg-slate-50/30">
                    <div className="space-y-1">
                      <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider">{t.subject}</span>
                      <h4 className="font-black text-gray-900 text-sm leading-tight">{selectedMessage.subject}</h4>
                    </div>
                    
                    {/* Header Action Tools */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleMarkReadToggle(selectedMessage.id)}
                        className={`p-1.5 border border-gray-200 hover:bg-gray-50 rounded-lg text-gray-500 hover:text-gray-800 transition-colors cursor-pointer text-[10px] font-black flex items-center gap-1`}
                        title={selectedMessage.read ? t.markUnread : t.markRead}
                      >
                        <Check className={`h-3.5 w-3.5 ${selectedMessage.read ? 'text-[#005c53]' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleDelete(selectedMessage.id)}
                        className="p-1.5 border border-red-100 hover:bg-red-50 rounded-lg text-red-500 transition-colors cursor-pointer"
                        title={t.deleteMsg}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Body Info and message detail */}
                  <div className="grow overflow-y-auto p-5 space-y-6">
                    {/* Meta info block */}
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-150">
                      <div className="h-9 w-9 rounded-xl bg-[#005c53]/10 text-[#005c53] flex items-center justify-center font-mono font-black text-sm uppercase">
                        {selectedMessage.sender.charAt(0)}
                      </div>
                      <div className="text-xs">
                        <p className="font-black text-gray-800">
                          <span className="text-gray-400 font-bold">{t.sender}:</span> {selectedMessage.sender}
                        </p>
                        <p className="font-bold text-gray-400 mt-0.5">
                          <span>{t.date}:</span> {selectedMessage.date}
                        </p>
                      </div>
                    </div>

                    {/* Paragraph message content */}
                    <div className="text-xs text-gray-700 leading-relaxed font-bold whitespace-pre-line p-1 bg-white">
                      {selectedMessage.content}
                    </div>

                    {/* Reply drafting area */}
                    <form onSubmit={handleSendReply} className="border-t border-gray-100 pt-5 space-y-3">
                      <div>
                        <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider flex items-center gap-1.5 mb-2">
                          <Reply className="h-3.5 w-3.5 text-[#005c53]" />
                          <span>{t.replyLabel}</span>
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={t.replyPlaceholder}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-2xl focus:bg-white focus:outline-none focus:border-[#005c53] font-bold text-xs text-gray-800 resize-none shadow-3xs transition-all"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-[#005c53] hover:bg-[#004d44] text-white text-xs font-black rounded-xl transition-all shadow-3xs cursor-pointer flex items-center gap-1.5"
                        >
                          <Send className="h-3.5 w-3.5" />
                          <span>{t.sendReply}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="grow flex flex-col items-center justify-center p-8 space-y-3 text-center text-gray-400">
                  <AlertCircle className="h-6 w-6" />
                  <p className="text-xs font-bold">{t.selectToRead}</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
