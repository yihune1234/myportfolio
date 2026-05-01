import { motion } from "framer-motion";
import { User, Award, Briefcase, Heart } from "lucide-react";

export default function AboutSection() {
  const stats = [
    { label: "Years Experience", value: "3+", icon: Award },
    { label: "Major Projects", value: "10+", icon: Briefcase },
    { label: "Professional Exp.", value: "2+", icon: Heart },
    { label: "Commitment", value: "100%", icon: User },
  ];

  return (
    <section id="about" className="section-padding bg-background relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[20%] h-[20%] bg-secondary/5 rounded-full blur-[80px] -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                About Me
              </h2>
              <div className="h-1.5 w-20 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
            </div>

            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-8 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <stat.icon className="w-12 h-12" />
                </div>
                
                <div className="relative z-10">
                  <div className={`p-3 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-all duration-500 bg-white/5 border border-white/10`}>
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-4xl font-black gradient-text mb-2 group-hover:text-primary transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.25em]">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
