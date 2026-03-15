import { Link } from 'react-router-dom'
import SectionHeading from '../components/ui/SectionHeading'
import AnimatedReveal from '../components/ui/AnimatedReveal'
import AnimatedCounter from '../components/ui/AnimatedCounter'
import { team } from '../data/content'

const parsedStats = [
  { target: 2.8, prefix: 'AED ', suffix: 'B+', label: 'Portfolio Value Transacted' },
  { target: 1200, prefix: '', suffix: '+', label: 'Properties Sold' },
  { target: 40, prefix: '', suffix: '+', label: 'Countries Served' },
  { target: 22, prefix: '', suffix: '+', label: 'Years of Expertise' },
]

export default function AboutPage() {
  return (
    <>
      {/* ═══════════════ HERO — Side-by-side with team ═══════════════ */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#064e3b' }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="container-wide px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
            {/* Left - Content */}
            <div className="pt-48 pb-14 lg:pt-56 lg:pb-20 lg:pr-12">
              <AnimatedReveal>
                <span className="eyebrow text-[10px] mb-5 block" style={{ color: 'rgba(201,168,76,0.7)' }}>About Us</span>
                <h1 className="text-white mb-5" style={{ fontFamily: 'var(--font-heading)', fontWeight: 300, lineHeight: 1.08 }}>
                  A Trusted Advisory<br />in Dubai{' '}
                  <span className="italic" style={{ color: '#c9a84c' }}>Real Estate</span>
                </h1>
                <p className="text-[14px] max-w-md leading-[1.85] mb-8" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)' }}>
                  Property Intelligence is not just our tagline — it's the philosophy that drives every decision, recommendation, and relationship we build.
                </p>
                {/* Stats strip */}
                <div className="flex flex-wrap gap-6 lg:gap-10">
                  {parsedStats.map((stat, i) => (
                    <div key={i}>
                      <div className="text-[22px] lg:text-[26px] mb-0.5" style={{ fontFamily: 'var(--font-heading)', color: '#c9a84c', fontWeight: 400 }}>
                        <AnimatedCounter target={stat.target} prefix={stat.prefix} suffix={stat.suffix} />
                      </div>
                      <div className="text-[8px] uppercase tracking-[0.16em]" style={{ fontFamily: 'var(--font-body)', fontWeight: 500, color: 'rgba(255,255,255,0.35)' }}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedReveal>
            </div>
            {/* Right - Team Photo */}
            <div className="relative lg:min-h-[550px]">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
                alt="Your Homes advisory team"
                className="w-full h-full object-cover lg:absolute lg:inset-0"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(6,78,59,0.3) 0%, transparent 40%)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ STORY ═══════════════ */}
      <section className="section-padding-lg" style={{ backgroundColor: '#faf8f5' }}>
        <div className="container-narrow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <AnimatedReveal>
              <div className="aspect-[4/5] img-zoom">
                <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80" alt="Dubai architecture" className="w-full h-full object-cover" />
              </div>
            </AnimatedReveal>
            <AnimatedReveal delay={0.2}>
              <span className="eyebrow mb-4 block">Our Story</span>
              <div className="gold-line mb-6" />
              <h2 className="mb-5" style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, color: '#1a1a1a' }}>
                Two Decades of Property Excellence
              </h2>
              <div className="space-y-4 text-[14px] leading-[1.85]" style={{ fontFamily: 'var(--font-body)', color: '#6b6b6b' }}>
                <p>Your Homes was founded on a simple conviction: real estate decisions deserve better intelligence. In a market often driven by hype, we chose to build an advisory firm rooted in research, transparency, and genuine expertise.</p>
                <p>Over 22 years, we have navigated every cycle of the Dubai property market — from its early boom to its global maturation. This gives us a perspective that transcends market noise and delivers real clarity.</p>
                <p>Today, we serve a global clientele of investors, families, and high-net-worth individuals across 40+ countries.</p>
              </div>
            </AnimatedReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ VALUES ═══════════════ */}
      <section className="section-padding" style={{ backgroundColor: '#ffffff' }}>
        <div className="container-narrow">
          <SectionHeading subtitle="Our Principles" title="What Sets Us Apart" description="Three pillars define every client experience." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { num: '01', title: 'Intelligence-Led Advisory', desc: "We don't just list properties. We analyze markets, forecast trends, and build strategies that align with your financial and lifestyle goals." },
              { num: '02', title: 'Curated, Not Catalogued', desc: 'Every property we present has been vetted, researched, and selected for its alignment with your criteria. Quality over quantity.' },
              { num: '03', title: 'Global Client, Local Expert', desc: "Whether you're in London, Singapore, or Riyadh, we bring global service standards with intimate knowledge of every Dubai community." },
            ].map((pillar, i) => (
              <AnimatedReveal key={i} delay={i * 0.12}>
                <div className="premium-card p-7 h-full">
                  <div className="text-[10px] uppercase tracking-[0.18em] font-bold mb-4" style={{ fontFamily: 'var(--font-body)', color: '#9a9a9a' }}>
                    {pillar.num}
                  </div>
                  <h4 className="text-[18px] mb-3" style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, color: '#1a1a1a' }}>
                    {pillar.title}
                  </h4>
                  <p className="text-[13px] leading-[1.75]" style={{ fontFamily: 'var(--font-body)', color: '#6b6b6b' }}>{pillar.desc}</p>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PARTNERSHIPS ═══════════════ */}
      <section className="section-padding" style={{ backgroundColor: '#faf8f5' }}>
        <div className="container-narrow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <AnimatedReveal>
              <span className="eyebrow mb-4 block">Developer Partnerships</span>
              <div className="gold-line mb-6" />
              <h2 className="mb-5" style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, color: '#1a1a1a' }}>
                Strategic Relationships with Premier Developers
              </h2>
              <p className="text-[14px] leading-[1.85] mb-6" style={{ fontFamily: 'var(--font-body)', color: '#6b6b6b' }}>
                Our partnerships with Emaar, Nakheel, Damac, Sobha provide clients privileged access to pre-launch opportunities, exclusive inventory, and preferential terms.
              </p>
              {/* Big logos */}
              <div className="flex flex-wrap gap-6 items-center">
                {['EMAAR', 'DAMAC', 'NAKHEEL', 'SOBHA'].map(dev => (
                  <span key={dev} className="text-[18px] lg:text-[22px] font-bold tracking-[0.18em] transition-colors duration-300 hover:text-emerald-deep cursor-default" style={{ fontFamily: 'var(--font-body)', color: '#1a1a1a' }}>{dev}</span>
                ))}
              </div>
            </AnimatedReveal>
            <AnimatedReveal delay={0.2}>
              <div className="aspect-[4/5] img-zoom">
                <img src="https://images.unsplash.com/photo-1582407947092-5469aaf27466?w=800&q=80" alt="Dubai development" className="w-full h-full object-cover" />
              </div>
            </AnimatedReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ TEAM ═══════════════ */}
      <section className="section-padding" style={{ backgroundColor: '#ffffff' }}>
        <div className="container-narrow">
          <SectionHeading subtitle="Our Advisors" title="Meet the Team" description="Dedicated property professionals committed to exceptional client experiences." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <AnimatedReveal key={member.id} delay={i * 0.1}>
                <div className="text-center group">
                  <div className="aspect-[3/4] img-zoom mb-4">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  </div>
                  <h4 className="text-[17px] mb-1" style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, color: '#1a1a1a' }}>{member.name}</h4>
                  <div className="text-[10px] uppercase tracking-[0.15em] mb-2" style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: '#c9a84c' }}>{member.role}</div>
                  <p className="text-[12px] leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: '#6b6b6b' }}>{member.bio}</p>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80" alt="Dubai" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(6,78,59,0.93), rgba(6,78,59,0.82))' }} />
        </div>
        <div className="relative z-10 container-narrow text-center px-6">
          <AnimatedReveal>
            <h2 className="text-white mb-5" style={{ fontFamily: 'var(--font-heading)', fontWeight: 300 }}>
              Let's Find Your <span className="italic" style={{ color: '#c9a84c' }}>Perfect Property</span>
            </h2>
            <p className="text-[14px] max-w-md mx-auto mb-9" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)' }}>
              Begin with a private consultation. Our team will build a personalised property strategy tailored to your goals.
            </p>
            <Link to="/contact" className="btn-gold">Book Your Consultation</Link>
          </AnimatedReveal>
        </div>
      </section>
    </>
  )
}
