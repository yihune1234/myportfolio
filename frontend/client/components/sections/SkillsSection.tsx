import { motion } from "framer-motion";
import {
  Globe, Server, Database, Shield, Cpu, Cloud, GitBranch, BrainCircuit,
} from "lucide-react";

interface SkillNode {
  name: string;
}

interface Layer {
  title: string;
  icon: typeof Globe;
  color: string;
  glow: string;
  nodes: SkillNode[];
}

export default function SkillsSection() {
  const layers: Layer[] = [
    {
      title: "Frontend",
      icon: Globe,
      color: "from-[#FF8A00] to-[#FF6B00]",
      glow: "shadow-[#FF8A00]/25",
      nodes: [
        { name: "React" },
        { name: "TypeScript" },
        { name: "Next.js" },
        { name: "Tailwind" },
        { name: "HTML5/CSS3" },
      ],
    },
    {
      title: "API Gateway",
      icon: GitBranch,
      color: "from-[#FF6B00] to-[#E85D00]",
      glow: "shadow-[#FF6B00]/25",
      nodes: [
        { name: "REST APIs" },
        { name: "GraphQL" },
        { name: "WebSockets" },
        { name: "API Design" },
      ],
    },
    {
      title: "Backend Services",
      icon: Server,
      color: "from-[#E85D00] to-[#CC4D00]",
      glow: "shadow-[#CC4D00]/25",
      nodes: [
        { name: "Node.js" },
        { name: "Django" },
        { name: "PHP" },
        { name: "Python" },
        { name: "Express" },
      ],
    },
    {
      title: "Authentication",
      icon: Shield,
      color: "from-[#CC4D00] to-[#B33E00]",
      glow: "shadow-[#B33E00]/25",
      nodes: [
        { name: "JWT" },
        { name: "OAuth" },
        { name: "BCrypt" },
        { name: "RBAC" },
      ],
    },
    {
      title: "Databases",
      icon: Database,
      color: "from-[#FF8A00] to-[#CC4D00]",
      glow: "shadow-[#FF8A00]/25",
      nodes: [
        { name: "PostgreSQL" },
        { name: "MongoDB" },
        { name: "Redis" },
        { name: "SQL" },
      ],
    },
    {
      title: "Cloud & DevOps",
      icon: Cloud,
      color: "from-[#FFB020] to-[#FF8A00]",
      glow: "shadow-[#FFB020]/25",
      nodes: [
        { name: "Docker" },
        { name: "AWS" },
        { name: "CI/CD" },
        { name: "Linux" },
        { name: "Git" },
      ],
    },
    {
      title: "AI & Automation",
      icon: BrainCircuit,
      color: "from-[#FFB020] to-amber-400",
      glow: "shadow-[#FFB020]/25",
      nodes: [
        { name: "LLMs" },
        { name: "AI APIs" },
        { name: "Automation" },
        { name: "Scripting" },
      ],
    },
  ];

  return (
    <section id="skills" className="section-padding relative overflow-hidden border-t border-white/[0.06]" style={{ background: "linear-gradient(90deg, #050816 0%, #0A1330 45%, #1A1325 100%)" }}>
      <div className="absolute inset-0 architecture-grid opacity-30" />
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#FF8A00] opacity-[0.05] rounded-full blur-[150px]" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FF8A00]/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#FFB020]/5 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-[#F5F7FA] mb-4">
            System Architecture
          </h2>
          <p className="text-[#B7C0D1] text-base max-w-2xl mx-auto leading-relaxed">
            Full-stack engineering ecosystem — from frontend interfaces to cloud infrastructure
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Central Pipeline */}
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#FF8A00]/40 via-[#FF6B00]/40 via-[#E85D00]/40 via-[#CC4D00]/40 via-[#B33E00]/40 via-[#FF8A00]/40 to-[#FFB020]/40" />

          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px overflow-hidden">
            <motion.div
              animate={{ top: ["-100%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 w-full h-20 bg-gradient-to-b from-transparent via-[#FF8A00] to-transparent"
            />
          </div>

          <div className="space-y-6">
            {layers.map((layer, layerIndex) => (
              <motion.div
                key={layer.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: layerIndex * 0.08 }}
                className="relative pl-14 sm:pl-16"
              >
                {/* Node */}
                <div className="absolute left-4 sm:left-6 top-8 -translate-x-1/2 z-10">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: layerIndex * 0.3 }}
                    className={`w-4 h-4 rounded-full bg-gradient-to-br ${layer.color} shadow-lg ${layer.glow}`}
                  />
                </div>

                {/* Card */}
                <div className={`group p-5 sm:p-6 rounded-2xl bg-[#0B1637] border border-white/[0.08] hover:bg-[#101B45] hover:border-[#FF8A00]/20 transition-all duration-500`}>
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${layer.color} shadow-lg`}>
                      <layer.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#050816]" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#F5F7FA]">
                        {layer.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {layer.nodes.map((node, nodeIndex) => (
                      <motion.span
                        key={node.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: (layerIndex * 0.08) + (nodeIndex * 0.05) }}
                        className="group/node relative px-3.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[11px] font-bold text-[#B7C0D1] hover:text-[#FF8A00] hover:border-[#FF8A00]/30 hover:bg-[#FF8A00]/[0.03] transition-all duration-300 cursor-default"
                      >
                        {node.name}
                        <span className={`absolute inset-0 rounded-lg opacity-0 group-hover/node:opacity-100 transition-opacity duration-300 bg-gradient-to-r ${layer.color} opacity-[0.04]`} />
                      </motion.span>
                    ))}
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
