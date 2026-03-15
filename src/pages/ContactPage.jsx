import AnimatedReveal from '../components/ui/AnimatedReveal'
import LeadCaptureForm from '../components/ui/LeadCaptureForm'

export default function ContactPage() {
  return (
    <>
      {/* ═══════════════ HERO — Confidential Consultation ═══════════════ */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#064e3b' }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="container-wide px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
            {/* Left — Content */}
            <div className="pt-48 pb-14 lg:pt-56 lg:pb-20 lg:pr-14">
              <AnimatedReveal>
                <span className="eyebrow text-[10px] mb-5 block" style={{ color: 'rgba(201,168,76,0.7)' }}>Get in Touch</span>
                <h1 className="text-white mb-5" style={{ fontFamily: 'var(--font-heading)', fontWeight: 300, lineHeight: 1.08, fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)' }}>
                  Confidential{' '}<br />
                  <span className="italic" style={{ color: '#c9a84c' }}>Consultation.</span>
                </h1>
                <p className="text-[14px] max-w-md leading-[1.85] mb-8" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)' }}>
                  Whether you're a first-time buyer or a seasoned investor, our advisory team
                  provides personalised guidance tailored to your goals. Every conversation is confidential.
                </p>

                {/* Contact Details */}
                <div className="space-y-4 mb-8">
                  {[
                    { label: 'Office', value: 'Boulevard Plaza, Tower 1, Downtown Dubai' },
                    { label: 'Phone', value: '+971 50 123 4567', href: 'tel:+971501234567' },
                    { label: 'Email', value: 'hello@yourhomes.ae', href: 'mailto:hello@yourhomes.ae' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-[9px] uppercase tracking-[0.15em] font-semibold min-w-[50px] pt-0.5" style={{ fontFamily: 'var(--font-body)', color: 'rgba(201,168,76,0.6)' }}>{item.label}</span>
                      {item.href ? (
                        <a href={item.href} className="text-[13px] transition-colors hover:text-white" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.55)' }}>{item.value}</a>
                      ) : (
                        <span className="text-[13px]" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.55)' }}>{item.value}</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Hours */}
                <div className="p-6 mt-10" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '2px' }}>
                  <h4 className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-4" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>Advisory Hours</h4>
                  <div className="space-y-2.5 text-[13px]" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)' }}>
                    <div className="flex justify-between items-center pb-2 border-b border-white/5"><span>Mon – Thu</span><span className="text-white/80">9 AM – 7 PM</span></div>
                    <div className="flex justify-between items-center pb-2 border-b border-white/5"><span>Friday</span><span className="text-white/80">9 AM – 12 PM, 2 PM – 7 PM</span></div>
                    <div className="flex justify-between items-center"><span>Saturday</span><span className="text-white/80">10 AM – 4 PM</span></div>
                  </div>
                </div>
              </AnimatedReveal>
            </div>

            {/* Right — Form */}
            <div className="bg-white py-14 px-8 lg:px-14 lg:py-20 flex flex-col justify-center relative">
              {/* Subtle top accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-deep to-gold-muted opacity-20" />
              
              <div className="max-w-md mx-auto w-full">
                <h3 className="text-[26px] mb-3" style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, color: '#1a1a1a' }}>
                  Private Consultation
                </h3>
                <p className="text-[14px] text-gray-warm mb-8 max-w-sm" style={{ fontFamily: 'var(--font-body)' }}>
                  Share your requirements — our advisory team will prepare a tailored property strategy for you.
                </p>
                <LeadCaptureForm variant="full" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom logos */}
        <div className="relative z-10 py-10" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="container-wide px-6 lg:px-10">
            <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-20">
              {['EMAAR', 'DAMAC', 'NAKHEEL', 'SOBHA'].map(dev => (
                <span key={dev} className="text-[20px] lg:text-[26px] font-bold tracking-[0.2em]" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.12)' }}>{dev}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
