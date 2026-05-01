import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Phone, GraduationCap, Calendar, BookOpen, Send, CheckCircle2, Loader } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { API_ENDPOINTS, apiFetch } from "@/lib/api";

export default function EducationSection() {
  const studyAreas = [
    "Data Structures & Algorithms",
    "Database Systems",
    "Web Development",
    "Mobile Application Dev",
    "Network Security",
    "Software Architecture",
    "Cloud Computing",
    "System Design",
    "Software Testing",
  ];

  return (
    <section id="education" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-emerald-50 to-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Education
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Education Main Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 p-8 md:p-12 rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white hover:shadow-lg transition-all group"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 leading-tight">
                  Bachelor of Science in <br />
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Computer Science</span>
                </h3>
                <p className="text-lg font-bold text-slate-600">
                  Haramaya University
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-8 h-8" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-y-2 border-emerald-200">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-emerald-100">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600 mb-1">Status</p>
                  <p className="font-bold text-slate-900">In Progress</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-emerald-100">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-600 mb-1">Focus</p>
                  <p className="font-bold text-slate-900">Software Engineering</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-lg text-slate-700 leading-relaxed">
                Pursuing a rigorous curriculum focused on foundational computer science principles, advanced software development methodologies, and system architecture.
              </p>
            </div>
          </motion.div>

          {/* Areas of Study */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h4 className="text-xl font-black text-slate-900 mb-6">Core Focus Areas</h4>
            <div className="grid grid-cols-1 gap-3">
              {studyAreas.map((area, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-3 rounded-lg bg-white border-2 border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50 transition-all group flex items-center gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                  <span className="font-bold text-sm text-slate-700">{area}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      setLoading(false);
      return;
    }

    try {
      const result = await apiFetch(API_ENDPOINTS.MESSAGES_CREATE, {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (result.success) {
        toast({ title: "Message Sent!", description: "I'll get back to you soon." });
        setFormData({ name: '', email: '', subject: '', message: '' });
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to send message.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: MapPin, label: "Location", value: "Addis Ababa, Ethiopia", color: "bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600" },
    { icon: Mail, label: "Email", value: "your-email@example.com", color: "bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600", href: "mailto:your-email@example.com" },
    { icon: Phone, label: "Phone", value: "+251 XXX XXX XXX", color: "bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600", href: "tel:+251900000000" },
  ];

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-blue-50 to-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Let's Connect
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-8 rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white space-y-8">
              <h3 className="text-2xl font-black text-slate-900">Contact Information</h3>
              <div className="space-y-6">
                {contactInfo.map((info, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-4 group"
                  >
                    <div className={`p-3 rounded-lg ${info.color}`}>
                      <info.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-600 mb-1">{info.label}</p>
                      {info.href ? (
                        <a href={info.href} className="font-bold text-slate-900 hover:text-blue-600 transition-colors">{info.value}</a>
                      ) : (
                        <p className="font-bold text-slate-900">{info.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
              <h4 className="font-black text-slate-900 mb-3">Availability</h4>
              <p className="text-slate-700 leading-relaxed">
                Open for full-time roles, freelance projects, and research collaborations. Typical response time: <span className="text-emerald-600 font-bold">24 hours</span>.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="p-8 md:p-12 rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white space-y-6 relative overflow-hidden">
              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 bg-white/95 flex flex-col items-center justify-center text-center p-8"
                  >
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6"
                    >
                      <CheckCircle2 className="w-10 h-10 text-blue-600" />
                    </motion.div>
                    <h3 className="text-3xl font-black text-slate-900 mb-2">Message Received!</h3>
                    <p className="text-slate-600 max-w-xs">Thank you for reaching out. I'll get back to you shortly.</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Name</label>
                  <input
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:border-blue-500 focus:bg-blue-50 transition-all outline-none text-slate-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:border-blue-500 focus:bg-blue-50 transition-all outline-none text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Subject</label>
                <input
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Project Inquiry"
                  className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:border-blue-500 focus:bg-blue-50 transition-all outline-none text-slate-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Message</label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell me about your project..."
                  className="w-full px-4 py-3 rounded-lg bg-white border-2 border-slate-200 focus:border-blue-500 focus:bg-blue-50 transition-all outline-none resize-none text-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader className="w-5 h-5 animate-spin" /> : (
                  <>
                    Send Message
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
