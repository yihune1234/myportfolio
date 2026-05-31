import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Trash2, 
  ChevronRight, 
  Search,
  MessageSquare,
  ArrowUpRight,
  Inbox,
  Send,
  X,
  CheckCircle
} from 'lucide-react';
import { API_ENDPOINTS, apiFetch } from '../../lib/api';
import { useToast } from '../../hooks/use-toast';

export function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [replySent, setReplySent] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const result = await apiFetch(API_ENDPOINTS.MESSAGES_LIST);
      if (result.success) {
        setMessages(result.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const result = await apiFetch(API_ENDPOINTS.MESSAGES_DELETE(id), {
        method: 'DELETE'
      });
      if (result.success) {
        toast({
          title: "Deleted",
          description: "Message has been removed."
        });
        fetchMessages();
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const openReply = () => {
    setReplyText('');
    setReplySent(false);
    setShowReplyModal(true);
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSending(true);
    try {
      const result = await apiFetch(API_ENDPOINTS.MESSAGES_REPLY(selectedMessage._id), {
        method: 'POST',
        body: JSON.stringify({ replyBody: replyText.trim() })
      });

      if (result.success) {
        setReplySent(true);
        toast({
          title: "Sent",
          description: "Your reply has been sent successfully."
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send reply.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Connection error while sending reply.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const filteredMessages = messages.filter(msg => 
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#F5F7FA] mb-1">Messages</h2>
          <p className="text-sm text-[#B7C0D1]">View and manage contact messages</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B7C0D1]/50" />
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#050816] border border-white/[0.08] rounded-lg outline-none focus:border-[#FF8A00]/50 transition-all text-sm text-[#F5F7FA] placeholder-[#B7C0D1]/40"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Messages Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 items-start">
        {/* Message List */}
        <div className="lg:col-span-2 space-y-2 sm:space-y-3">
          <div className="text-[10px] font-bold text-[#B7C0D1]/60 uppercase tracking-[0.2em] px-4 py-2">
            <Inbox size={12} className="inline mr-1.5" />
            {filteredMessages.length} Message{filteredMessages.length !== 1 ? 's' : ''}
          </div>
          <AnimatePresence mode="popLayout">
            {filteredMessages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 sm:py-16 rounded-lg border border-white/[0.06] bg-[#0B1637] flex flex-col items-center justify-center text-center space-y-3"
              >
                <MessageSquare size={32} className="text-[#FF8A00]/30" />
                <div>
                  <p className="text-sm font-bold text-[#F5F7FA]">No messages found</p>
                  <p className="text-xs text-[#B7C0D1]">Try adjusting your search</p>
                </div>
              </motion.div>
            ) : (
              filteredMessages.map((msg, idx) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedMessage(msg)}
                  className={`group relative p-3 sm:p-4 rounded-lg cursor-pointer transition-all border ${
                    selectedMessage?._id === msg._id 
                    ? 'bg-[#FF8A00]/10 border-[#FF8A00]/30 shadow-lg shadow-[#FF8A00]/5' 
                    : 'border-white/[0.06] bg-[#0B1637] hover:border-white/[0.12] hover:bg-[#101B45]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs sm:text-sm font-black flex-shrink-0 ${
                      selectedMessage?._id === msg._id 
                        ? 'bg-gradient-to-br from-[#FF8A00] to-[#FF6B00] text-[#050816]' 
                        : 'bg-[#050816] text-[#FF8A00] border border-white/[0.06]'
                    }`}>
                      {msg.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#F5F7FA] text-sm truncate">
                        {msg.name}
                      </h4>
                      <p className="text-xs text-[#B7C0D1]/60 truncate">
                        {msg.subject || 'No subject'}
                      </p>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-all flex-shrink-0 ${
                      selectedMessage?._id === msg._id ? 'text-[#FF8A00]' : 'text-[#B7C0D1]/30'
                    }`} />
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-3 sticky top-24">
          <AnimatePresence mode="wait">
            {selectedMessage ? (
              <motion.div
                key={selectedMessage._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="rounded-lg border border-white/[0.06] bg-[#0B1637] overflow-hidden shadow-lg shadow-black/20 flex flex-col"
              >
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-white/[0.06] bg-gradient-to-r from-[#0B1637] to-[#101B45]">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-gradient-to-br from-[#FF8A00] to-[#FF6B00] flex items-center justify-center text-[#050816] font-bold text-sm sm:text-base flex-shrink-0">
                        {selectedMessage.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-[#F5F7FA] text-sm sm:text-base truncate">{selectedMessage.name}</h3>
                        <p className="text-xs text-[#B7C0D1] flex items-center gap-1 truncate">
                          <Mail size={12} /> {selectedMessage.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(selectedMessage._id)}
                      className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all flex-shrink-0"
                      title="Delete message"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <div>
                    <h4 className="font-bold text-[#B7C0D1] mb-2 text-xs uppercase tracking-wider">Subject</h4>
                    <p className="text-[#F5F7FA] font-medium text-sm">
                      {selectedMessage.subject || 'No subject'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-[#B7C0D1] mb-2 text-xs uppercase tracking-wider">Message</h4>
                    <p className="text-[#B7C0D1] whitespace-pre-wrap leading-relaxed text-sm">
                      {selectedMessage.message}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/[0.06]">
                    <div className="p-3 bg-[#050816] rounded-lg">
                      <span className="text-[10px] font-bold text-[#B7C0D1]/60 block mb-1 uppercase tracking-wider">Date</span>
                      <p className="text-xs sm:text-sm font-bold text-[#F5F7FA]">
                        {new Date(selectedMessage.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="p-3 bg-[#050816] rounded-lg">
                      <span className="text-[10px] font-bold text-[#B7C0D1]/60 block mb-1 uppercase tracking-wider">Time</span>
                      <p className="text-xs sm:text-sm font-bold text-[#F5F7FA]">
                        {new Date(selectedMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-6 border-t border-white/[0.06] bg-[#050816]">
                  <button
                    onClick={openReply}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] text-[#050816] rounded-lg font-bold text-sm hover:shadow-[0_0_25px_rgba(255,138,0,0.25)] transition-all"
                  >
                    Reply
                    <Send size={16} />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-96 rounded-lg border-2 border-dashed border-white/[0.06] bg-[#0B1637] flex flex-col items-center justify-center text-center space-y-4 p-4"
              >
                <MessageSquare size={40} className="text-[#FF8A00]/20" />
                <div>
                  <h3 className="font-bold text-[#F5F7FA] mb-1 text-sm">No message selected</h3>
                  <p className="text-xs text-[#B7C0D1]">Select a message to view details</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Reply Modal */}
      <AnimatePresence>
        {showReplyModal && selectedMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => !sending && setShowReplyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-lg rounded-xl border border-white/[0.08] bg-[#0B1637] shadow-2xl shadow-black/60"
              onClick={e => e.stopPropagation()}
            >
              {replySent ? (
                <div className="p-8 sm:p-10 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#22C55E]/10 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-[#22C55E]" />
                  </div>
                  <h3 className="text-xl font-black text-[#F5F7FA] mb-2">Reply Sent!</h3>
                  <p className="text-sm text-[#B7C0D1] mb-6">
                    Your reply to <span className="text-[#FF8A00] font-bold">{selectedMessage.name}</span> has been sent.
                  </p>
                  <button
                    onClick={() => setShowReplyModal(false)}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] text-[#050816] rounded-lg font-bold text-sm hover:shadow-[0_0_25px_rgba(255,138,0,0.25)] transition-all"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="p-4 sm:p-6 border-b border-white/[0.06] flex items-center justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-[#F5F7FA]">Reply to {selectedMessage.name}</h3>
                      <p className="text-xs text-[#B7C0D1]">Re: {selectedMessage.subject}</p>
                    </div>
                    <button
                      onClick={() => setShowReplyModal(false)}
                      className="p-2 hover:bg-white/[0.06] rounded-lg transition-colors text-[#B7C0D1] hover:text-[#F5F7FA]"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSendReply} className="p-4 sm:p-6 space-y-4">
                    <div>
                      <label className="text-xs font-bold text-[#B7C0D1] block mb-2">Your Reply</label>
                      <textarea
                        required
                        rows="6"
                        className="w-full px-4 py-3 bg-[#050816] border border-white/[0.08] rounded-lg outline-none focus:border-[#FF8A00]/50 transition-all font-medium text-[#F5F7FA] placeholder-[#B7C0D1]/40 resize-none text-sm"
                        placeholder="Type your reply here..."
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowReplyModal(false)}
                        disabled={sending}
                        className="flex-1 py-2.5 bg-white/[0.04] text-[#B7C0D1] rounded-lg font-bold hover:bg-white/[0.08] transition-all text-sm disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={sending || !replyText.trim()}
                        className="flex-1 py-2.5 bg-gradient-to-r from-[#FF8A00] to-[#FF6B00] text-[#050816] rounded-lg font-bold hover:shadow-[0_0_25px_rgba(255,138,0,0.25)] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                      >
                        {sending ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="w-4 h-4 border-2 border-[#050816]/30 border-t-[#050816] rounded-full"
                            />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            Send Reply
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}