import { useState, useEffect } from 'react'
import AnimatedReveal from '../components/ui/AnimatedReveal'
import LeadCaptureForm from '../components/ui/LeadCaptureForm'
import { DeveloperLogos } from '../components/ui/DeveloperLogos'
import { fetchSettings } from '../utils/api'

export default function ContactPage() {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    fetchSettings().then(data => {
      if (data) setSettings(data)
    })
  }, [])

  const defaults = {
    address: 'A-202, Prime Business Center, POBOX: 123022, Dubai',
    phone: '+971 4 454 1313',
    email: 'info@yourhomes.ae'
  }

  const contactDetails = {
    ...defaults,
    ...settings
  }

  const items = [
    { label: 'Office', value: contactDetails.address },
    { label: 'Phone', value: contactDetails.phone, href: `tel:${(contactDetails.phone || '').replace(/\s+/g, '')}` },
    { label: 'Email', value: contactDetails.email, href: `mailto:${contactDetails.email}` },
  ]

  return (
    <>
      {/* ═══════════════ HERO — Confidential Consultation ═══════════════ */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#0E3A2F' }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="container-wide px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
            {/* Left — Content */}
            <div className="pt-48 pb-14 lg:pt-56 lg:pb-20 lg:pr-14">
              <AnimatedReveal>
                <span className="eyebrow text-[10px] mb-5 block" style={{ color: 'rgba(201,168,76,0.7)' }}>Get in Touch</span>
                <h1 className="text-white mb-5" style={{ fontFamily: 'var(--font-heading)', fontWeight: 300, lineHeight: 1.08, fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)' }}>
                  Confidential{' '}<br />
                  <span className="italic" style={{ color: '#C2A76D' }}>Consultation.</span>
                </h1>
                <p className="text-[14px] max-w-md leading-[1.85] mb-8" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.5)' }}>
                  Whether you're a first-time buyer or a seasoned investor, our advisory team
                  provides personalised guidance tailored to your goals. Every conversation is confidential.
                </p>

                {/* Contact Details */}
                <div className="space-y-4 mb-8">
                  {items.map((item, i) => (
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
                    <div className="flex justify-between items-center pb-2 border-b border-white/5"><span>Monday – Saturday</span><span className="text-white/80">9 AM – 6 PM</span></div>
                    <div className="flex justify-between items-center text-white/20 italic"><span>Sunday</span><span>Closed</span></div>
                  </div>
                </div>
              </AnimatedReveal>
            </div>

            {/* Right — Form */}
            <div className="bg-white rounded-lg shadow-xl relative mt-16 mb-16 lg:mt-32 lg:mb-20 overflow-hidden flex flex-col justify-center">
              {/* Subtle top accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-deep to-gold-muted opacity-80" />
              
              <div className="p-10 lg:p-14 w-full h-full flex flex-col justify-center bg-white/95 backdrop-blur-sm">
                <h3 className="text-[26px] mb-3" style={{ fontFamily: 'var(--font-heading)', fontWeight: 500, color: '#1a1a1a' }}>
                  Private Consultation
                </h3>
                <p className="text-[14px] text-gray-warm mb-8 max-w-sm" style={{ fontFamily: 'var(--font-body)' }}>
                  Share your requirements — our advisory team will prepare a tailored property strategy for you.
                </p>
                <div className="relative z-10 bg-white">
                  <LeadCaptureForm variant="full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom logos */}
        <div className="relative z-10 py-10" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="container-wide px-6 lg:px-10">
            <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-20 text-white/20">
              <DeveloperLogos.Emaar />
              <DeveloperLogos.Damac />
              <DeveloperLogos.Nakheel />
              <DeveloperLogos.Sobha />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
