import { ArrowRight, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  onContactClick: () => void;
  onProjectsClick: () => void;
}

export default function HeroSection({
  onContactClick,
  onProjectsClick,
}: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative min-h-screen pt-28 pb-12 overflow-hidden bg-white"
    >
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[10%] -left-[10%] w-[80%] md:w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-[20%] -right-[10%] w-[60%] md:w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[100px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          {/* Content */}
          <div className="relative z-10 text-center lg:text-left order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-primary text-[10px] sm:text-xs font-bold mb-6 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Available for new opportunities
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-6 tracking-tighter leading-[0.9]">
                Building <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-purple-600">
                  Digital Future.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-lg mb-10 font-medium mx-auto lg:mx-0">
                I am <span className="text-slate-900 font-bold">Yihune Belay</span>, a Full Stack Developer specializing in crafting high-performance backend systems and elegant user experiences.
              </p>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <button
                  onClick={onContactClick}
                  className="px-8 py-4 bg-primary text-white rounded-full font-bold hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group shadow-xl shadow-primary/20"
                >
                  Start a Project
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={onProjectsClick}
                  className="px-8 py-4 bg-slate-50 text-slate-900 border border-slate-200 rounded-full font-bold hover:bg-slate-100 transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-2 group"
                >
                  View Work
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform opacity-50" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Profile Image with Glass Effect */}
          <div className="relative flex justify-center lg:justify-end order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="relative w-full max-w-[280px] sm:max-w-md aspect-[4/5] group"
            >
              {/* Animated Border */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-purple-600 rounded-[2.5rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-500" />
              
              <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden border border-slate-200 bg-white shadow-2xl p-3">
                <div className="h-full w-full rounded-[2rem] overflow-hidden grayscale-[0.2] hover:grayscale-0 transition-all duration-700">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F729ed1e6158f4fddaa5c79dd9410d623%2F1fd6f14adfa546439d0e1614fe59db76?format=webp&width=800&height=1200"
                    alt="Yihune Belay"
                    className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                  />
                </div>

                {/* Floating Stats Glassmorphism */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 p-4 sm:p-6 rounded-3xl bg-white shadow-2xl border border-slate-100"
                >
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">3+</p>
                  <p className="text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Years Experience</p>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 p-4 sm:p-6 rounded-3xl bg-white shadow-2xl border border-slate-100"
                >
                  <p className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">Backend<br/>Mastery</p>
                  <p className="text-[8px] sm:text-[10px] font-bold text-primary uppercase tracking-wider mt-1">Specialist</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
