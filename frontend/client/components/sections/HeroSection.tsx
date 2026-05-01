import { ArrowRight } from "lucide-react";

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
      className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex items-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="animate-fadeInDown">
            <div className="mb-6">
              <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-slate-900 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Yihune Belay
              </h1>
              <p className="text-xl md:text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
                Full Stack Software Developer
              </p>
              <p className="text-lg md:text-xl text-slate-600 mt-2">
                Backend & Mobile Systems Specialist
              </p>
            </div>

            <p className="text-base md:text-lg text-slate-700 leading-relaxed max-w-lg mb-8">
              I design and build scalable, secure, and high-performance web and
              mobile applications. With a strong foundation in backend
              development and API architecture, I focus on delivering reliable
              solutions that solve real-world problems.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={onContactClick}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg"
              >
                Let's Work Together
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onProjectsClick}
                className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-bold hover:bg-blue-50 hover:border-purple-600 hover:text-purple-600 transition-all duration-300"
              >
                View My Work
              </button>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-slate-600 hover:text-blue-600 transition-colors"
                title="GitHub"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-slate-600 hover:text-blue-600 transition-colors"
                title="LinkedIn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554v-11h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 8.855c-1.144 0-2.083-.931-2.083-2.076 0-1.144.92-2.083 2.083-2.083 1.144 0 2.084.92 2.084 2.083 0 1.144-.94 2.076-2.084 2.076zm1.782 11.597H3.555v-11h3.564v11zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="mailto:your-email@example.com"
                className="text-slate-600 hover:text-blue-600 transition-colors"
                title="Email"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Profile Image */}
          <div className="animate-fadeInUp flex justify-center lg:justify-end">
            <div className="relative">
              {/* Animated background with gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-purple-200 to-slate-100 rounded-2xl blur-3xl opacity-60"></div>

              {/* Image container with gradient border effect */}
              <div className="relative bg-white rounded-2xl p-1 overflow-hidden shadow-2xl border-2 border-transparent bg-gradient-to-br from-blue-400 to-purple-400 bg-clip-border">
                <div className="bg-white rounded-xl overflow-hidden">
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets%2F729ed1e6158f4fddaa5c79dd9410d623%2F1fd6f14adfa546439d0e1614fe59db76?format=webp&width=800&height=1200"
                    alt="Yihune Belay - Full Stack Software Developer"
                    className="w-full max-w-sm rounded-lg"
                  />
                </div>
              </div>

              {/* Floating badges with gradient */}
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-br from-blue-600 to-purple-600 text-white p-4 rounded-xl shadow-lg border border-white/20">
                <p className="text-sm font-bold">
                  3+ Years Experience
                </p>
                <p className="text-xs opacity-90">
                  Full Stack Development
                </p>
              </div>

              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-purple-600 to-blue-600 text-white p-4 rounded-xl shadow-lg border border-white/20">
                <p className="text-sm font-bold">
                  Backend Specialist
                </p>
                <p className="text-xs opacity-90">
                  API & System Design
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
