import { Mail, MapPin, Phone } from "lucide-react";

export default function EducationSection() {
  return (
    <section
      id="education"
      className="py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Education</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
        </div>

        <p className="text-lg text-foreground/80 leading-relaxed mb-12">
          Pursuing a degree in Computer Science with a focus on software engineering, systems design, and modern development practices. Continuous learning drives my professional growth.
        </p>

        <div className="group p-8 rounded-xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                Bachelor of Science in Computer Science
              </h3>
              <p className="text-lg text-primary font-semibold">
                Haramaya University
              </p>
            </div>
            <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:shadow-lg transition-all">
              <span className="text-2xl">🎓</span>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Status</p>
                <p className="font-bold text-foreground">In Progress</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Field</p>
                <p className="font-bold text-foreground">Software Eng.</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Focus</p>
                <p className="font-bold text-foreground">Backend Systems</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Location</p>
                <p className="font-bold text-foreground">Addis Ababa</p>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Paths */}
        <div className="mt-12 p-8 rounded-xl border border-border bg-gradient-to-br from-primary/5 to-secondary/5">
          <h3 className="text-2xl font-bold text-foreground mb-6">
            Areas of Study
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Data Structures & Algorithms",
              "Database Systems",
              "Web Development",
              "Mobile Application Dev",
              "Network Security",
              "Software Architecture",
              "Cloud Computing",
              "System Design",
              "Software Testing",
            ].map((area, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-card border border-primary/20 hover:border-primary/50 transition-all"
              >
                <p className="font-semibold text-foreground">{area}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section
      id="contact"
      className="py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Get In Touch</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <p className="text-lg text-foreground/80 leading-relaxed">
              I'm always open to new opportunities, collaborations, and
              conversations. Feel free to reach out through any of the channels
              below. I'll get back to you as soon as possible.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-all">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold text-foreground">
                    Addis Ababa, Ethiopia
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-all">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a
                    href="mailto:your-email@example.com"
                    className="font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    your-email@example.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-all">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <a
                    href="tel:your-phone-number"
                    className="font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    Your Phone Number
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-6 rounded-xl border border-border bg-card">
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Your name"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="your-email@example.com"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Your message here..."
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-6">
            Services I Offer
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Full Stack Web Application Development",
              "Backend System & API Development",
              "Mobile Application Development",
              "Database Design and Optimization",
              "System Integration and API Services",
              "Code Review & Consultation",
            ].map((service, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <p className="font-semibold text-foreground">{service}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
