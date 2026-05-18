import AnimatedReveal from '../components/ui/AnimatedReveal'

export default function TermsPage() {
  return (
    <section className="pt-44 pb-20 lg:pt-52 lg:pb-28" style={{ backgroundColor: '#f7f6f3' }}>
      <div className="container-narrow px-6">
        <AnimatedReveal>
          <div className="text-[11px] uppercase tracking-[0.3em] mb-4" style={{ color: '#c2a76d', fontFamily: 'var(--font-body)' }}>
            Legal
          </div>
          <h1 className="mb-10" style={{ fontFamily: 'var(--font-heading)', fontWeight: 300 }}>
            Terms & Conditions
          </h1>
          <div className="prose max-w-none space-y-8" style={{ fontFamily: 'var(--font-body)' }}>
            <div>
              <h3 className="text-xl mb-3" style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}>
                Acceptance of Terms
              </h3>
              <p className="text-[15px] text-gray-warm leading-[1.9]">
                By accessing and using the Sanda Estate website, you accept and agree to be bound by the terms and conditions outlined herein. If you do not agree with these terms, please refrain from using our website.
              </p>
            </div>
            <div>
              <h3 className="text-xl mb-3" style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}>
                Services
              </h3>
              <p className="text-[15px] text-gray-warm leading-[1.9]">
                Sanda Estate provides real estate advisory, property intelligence, and brokerage services in the Dubai property market. All property information, pricing, and availability are subject to change without notice and should be independently verified.
              </p>
            </div>
            <div>
              <h3 className="text-xl mb-3" style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}>
                Intellectual Property
              </h3>
              <p className="text-[15px] text-gray-warm leading-[1.9]">
                All content, design, graphics, and materials on this website are the property of Sanda Estate and are protected by applicable intellectual property laws. Reproduction, distribution, or use of any content without prior written consent is strictly prohibited.
              </p>
            </div>
            <div>
              <h3 className="text-xl mb-3" style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}>
                Disclaimer
              </h3>
              <p className="text-[15px] text-gray-warm leading-[1.9]">
                While we strive to ensure accuracy, Sanda Estate makes no warranties or representations about the completeness, accuracy, or reliability of any information on this website. Property investments carry inherent risks and past performance is not indicative of future results.
              </p>
            </div>
            <div>
              <h3 className="text-xl mb-3" style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}>
                Governing Law
              </h3>
              <p className="text-[15px] text-gray-warm leading-[1.9]">
                These terms are governed by the laws of the United Arab Emirates and the Emirate of Dubai. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the Dubai courts.
              </p>
            </div>
            <p className="text-[13px] text-gray-soft italic">
              Last updated: March 2026
            </p>
          </div>
        </AnimatedReveal>
      </div>
    </section>
  )
}
