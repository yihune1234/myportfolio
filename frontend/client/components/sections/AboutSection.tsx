import { motion } from "framer-motion";
import { User, Award, Briefcase, Heart } from "lucide-react";

export default function AboutSection() {
  const stats = [
    { label: "Years Experience", value: "3+", icon: Award, color: "bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600", border: "border-blue-200" },
    { label: "Major Projects", value: "10+", icon: Briefcase, color: "bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600", border: "border-purple-200" },
    { label: "Professional Exp.", value: "2+", icon: Heart, color: "bg-gradient-to-br from-pink-100 to-pink-50 text-pink-600", border: "border-pink-200" },
    { label: "Commitment", value: "100%", icon: User, color: "bg-gradient-to-br from-orange-100 to-orange-50 text-orange-600", border: "border-orange-200" },
  ];

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-blue-50 to-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                About Me
              </h2>
              <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
            </div>

            <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
              <p>
                I am a Software Developer based in Addis Ababa, Ethiopia, currently
                pursuing a Bachelor's degree in Computer Science at Haramaya
                University. I specialize in full stack development with a strong
                emphasis on backend systems, API design, and mobile application
                development.
              </p>

              <p>
                I have hands-on experience developing and integrating RESTful APIs,
                designing efficient database systems, and building cross-platform
                mobile applications. I am particularly interested in secure and
                scalable systems, including digital identity solutions and
                distributed architectures.
              </p>

              <p>
                I am committed to continuous learning and enjoy working in
                collaborative environments where I can contribute to building
                impactful and reliable software products. My passion lies in
                creating elegant solutions to complex problems while maintaining
                code quality and best practices.
              </p>
            </div>
          </motion.div>

          {/* Right Column: Stats Grid */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-6 md:p-8 rounded-xl border-2 ${stat.border} bg-white hover:shadow-lg transition-all group`}
              >
                <div className={`p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-slate-600 uppercase tracking-widest">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
