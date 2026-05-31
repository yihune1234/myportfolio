import { motion } from "framer-motion";
import { Monitor, Smartphone, Globe, Gauge } from "lucide-react";

export default function PlatformShowcase() {
  const platforms = [
    {
      title: "Web Applications",
      icon: Monitor,
      desc: "Responsive SPAs, dashboards, and full-stack web platforms built with modern frameworks.",
      features: ["React / Next.js", "TypeScript", "Tailwind CSS", "REST APIs"],
      color: "from-[#FF8A00] to-[#FF6B00]",
    },
    {
      title: "Mobile Applications",
      icon: Smartphone,
      desc: "Cross-platform mobile apps with native performance and clean architecture.",
      features: ["React Native", "Expo", "Mobile APIs", "Push Notifications"],
      color: "from-[#FF6B00] to-[#E85D00]",
    },
    {
      title: "API & Backend Systems",
      icon: Globe,
      desc: "Scalable microservices, RESTful APIs, and backend infrastructure.",
      features: ["Node.js / Django", "PostgreSQL / MongoDB", "Redis", "Docker"],
      color: "from-[#CC4D00] to-[#FF8A00]",
    },
    {
      title: "Performance Engineering",
      icon: Gauge,
      desc: "Optimized rendering, caching strategies, and performance monitoring.",
      features: ["Code Splitting", "Lazy Loading", "CDN Optimization", "Caching"],
      color: "from-[#FFB020] to-[#FF8A00]",
    },
  ];

  return (
    <section id="platforms" className="section-padding relative overflow-hidden bg-background border-t border-white/[0.08]">
      <div className="absolute -top-32 -right-32 w-[400px] h-[400px] bg-[#FF8A00] opacity-[0.05] rounded-full blur-[150px]" />
      <div className="absolute top-1/3 -left-32 w-[350px] h-[350px] bg-[#FFB020]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 -right-32 w-[250px] h-[250px] bg-[#FF8A00]/5 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-[#F5F7FA] mb-4">
            Cross-Platform Engineering
          </h2>
          <p className="text-[#B7C0D1] text-base max-w-2xl mx-auto leading-relaxed">
            Building across web, mobile, and infrastructure — delivering cohesive, scalable experiences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {platforms.map((platform, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.04] hover:border-primary/20 transition-all duration-500"
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${platform.color} opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500`} />
              <div className="relative z-10">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${platform.color} shadow-lg w-fit mb-5 group-hover:scale-110 transition-transform duration-500`}>
                  <platform.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#F5F7FA] mb-3 group-hover:text-primary transition-colors">
                  {platform.title}
                </h3>
                <p className="text-xs text-[#B7C0D1] leading-relaxed mb-5">
                  {platform.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {platform.features.map((feature, fIdx) => (
                    <span
                      key={fIdx}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[10px] font-bold text-[#B7C0D1]"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
