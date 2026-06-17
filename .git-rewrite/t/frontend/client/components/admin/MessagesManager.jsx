import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Trash2, 
  User, 
  Calendar, 
  ChevronRight, 
  Search,
  MessageSquare,
  ArrowUpRight
} from 'lucide-react';
import { API_ENDPOINTS, apiFetch } from '../../lib/api';
import { useToast } from '../../hooks/use-toast';

export function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">Messages</h2>
          <p className="text-sm text-slate-600">View and manage contact messages</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Messages Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 items-start">
        {/* Message List */}
        <div className="lg:col-span-2 space-y-2 sm:space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest px-4 py-2">
            {filteredMessages.length} Message{filteredMessages.length !== 1 ? 's' : ''}
          </div>
          <AnimatePresence mode="popLayout">
            {filteredMessages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12 sm:py-16 rounded-lg bg-slate-100 flex flex-col items-center justify-center text-center space-y-3"
              >
                <MessageSquare size={32} className="text-slate-400" />
                <div>
                  <p className="text-sm font-bold text-slate-600">No messages found</p>
                  <p className="text-xs text-slate-500">Try adjusting your search</p>
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
                    ? 'bg-blue-50 border-blue-300 shadow-md' 
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs sm:text-sm font-black flex-shrink-0 ${
                      selectedMessage?._id === msg._id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {msg.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-sm truncate">
                        {msg.name}
                      </h4>
                      <p className="text-xs text-slate-500 truncate">
                        {msg.subject || 'No subject'}
                      </p>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-all flex-shrink-0 ${selectedMessage?._id === msg._id ? 'text-blue-600' : 'text-slate-300'}`} />
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
                className="rounded-lg bg-white border border-slate-200 overflow-hidden shadow-sm flex flex-col h-full"
              >
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-white">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                        {selectedMessage.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate">{selectedMessage.name}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                          <Mail size={12} /> {selectedMessage.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(selectedMessage._id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all flex-shrink-0"
                      title="Delete message"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-4 sm:space-y-6">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2 text-sm">Subject</h4>
                    <p className="text-slate-700 font-medium text-sm">
                      {selectedMessage.subject || 'No subject'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 mb-2 text-sm">Message</h4>
                    <p className="text-slate-600 whitespace-pre-wrap leading-relaxed text-sm">
                      {selectedMessage.message}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-xs font-bold text-slate-500 block mb-1">Date</span>
                      <p className="text-xs sm:text-sm font-bold text-slate-900">
                        {new Date(selectedMessage.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <span className="text-xs font-bold text-slate-500 block mb-1">Time</span>
                      <p className="text-xs sm:text-sm font-bold text-slate-900">
                        {new Date(selectedMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold text-sm hover:shadow-lg transition-all"
                  >
                    Reply
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-96 rounded-lg bg-slate-50 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-center space-y-4 p-4"
              >
                <MessageSquare size={40} className="text-slate-300" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1 text-sm">No message selected</h3>
                  <p className="text-xs text-slate-600">Select a message to view details</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
