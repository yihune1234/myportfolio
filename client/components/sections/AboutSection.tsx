export default function AboutSection() {
  return (
    <section
      id="about"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">About Me</span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
        </div>

        <div className="prose prose-sm md:prose-base max-w-none">
          <p className="text-lg text-foreground/80 leading-relaxed mb-6">
            I am a Software Developer based in Addis Ababa, Ethiopia, currently
            pursuing a Bachelor's degree in Computer Science at Haramaya
            University. I specialize in full stack development with a strong
            emphasis on backend systems, API design, and mobile application
            development.
          </p>

          <p className="text-lg text-foreground/80 leading-relaxed mb-6">
            I have hands-on experience developing and integrating RESTful APIs,
            designing efficient database systems, and building cross-platform
            mobile applications. I am particularly interested in secure and
            scalable systems, including digital identity solutions and
            distributed architectures.
          </p>

          <p className="text-lg text-foreground/80 leading-relaxed">
            I am committed to continuous learning and enjoy working in
            collaborative environments where I can contribute to building
            impactful and reliable software products. My passion lies in
            creating elegant solutions to complex problems while maintaining
            code quality and best practices.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-12 border-t border-border">
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold gradient-text">3+</p>
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              Years Experience
            </p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold gradient-text">4+</p>
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              Major Projects
            </p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold gradient-text">2+</p>
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              Professional Experiences
            </p>
          </div>
          <div className="text-center">
            <p className="text-4xl md:text-5xl font-bold gradient-text">100%</p>
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              Commitment
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
