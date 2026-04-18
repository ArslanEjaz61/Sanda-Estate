import { useState, useEffect } from 'react'
import AnimatedReveal from '../components/ui/AnimatedReveal'
import { fetchSettings } from '../utils/api'

export default function PrivacyPage() {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    fetchSettings().then(data => {
      if (data) setSettings(data)
    })
  }, [])

  const contactInfo = settings || {
    address: 'A-202, Prime Business Center, Dubai, UAE',
    email: 'info@yourhomes.ae'
  }

  return (
    <section className="pt-44 pb-20 lg:pt-52 lg:pb-28" style={{ backgroundColor: '#f7f6f3' }}>
      <div className="container-narrow px-6">
        <AnimatedReveal>
          <div className="text-[11px] uppercase tracking-[0.3em] mb-4" style={{ color: '#c2a76d', fontFamily: 'var(--font-body)' }}>
            Legal
          </div>
          <h1 className="mb-10" style={{ fontFamily: 'var(--font-heading)', fontWeight: 300 }}>
            Privacy Policy
          </h1>
          <div className="prose max-w-none space-y-8" style={{ fontFamily: 'var(--font-body)' }}>
            <div>
              <h3 className="text-xl mb-3" style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}>
                Introduction
              </h3>
              <p className="text-[15px] text-gray-warm leading-[1.9]">
                Your Homes ("we", "our", "us") is committed to protecting the privacy of our clients and website visitors. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our website or engage with our services.
              </p>
            </div>
            <div>
              <h3 className="text-xl mb-3" style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}>
                Information We Collect
              </h3>
              <p className="text-[15px] text-gray-warm leading-[1.9]">
                We may collect personal information including your name, email address, phone number, property preferences, and budget range when you submit inquiry forms, subscribe to our updates, or contact us directly. We also collect non-personal data through cookies and analytics tools to improve our website experience.
              </p>
            </div>
            <div>
              <h3 className="text-xl mb-3" style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}>
                How We Use Your Information
              </h3>
              <p className="text-[15px] text-gray-warm leading-[1.9]">
                Your information is used to provide personalised property recommendations, respond to inquiries, schedule consultations, and send relevant market updates. We do not sell or rent your personal information to third parties. We may share information with trusted service providers who assist in our operations, subject to confidentiality agreements.
              </p>
            </div>
            <div>
              <h3 className="text-xl mb-3" style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}>
                Data Protection
              </h3>
              <p className="text-[15px] text-gray-warm leading-[1.9]">
                We implement industry-standard security measures to protect your personal data. All data transmissions are encrypted using SSL technology. Access to personal information is restricted to authorized personnel only.
              </p>
            </div>
            <div>
              <h3 className="text-xl mb-3" style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}>
                Your Rights
              </h3>
              <p className="text-[15px] text-gray-warm leading-[1.9]">
                You have the right to access, correct, or delete your personal data at any time. To exercise these rights, please contact us at {contactInfo.email}. We will respond to all requests within 30 days.
              </p>
            </div>
            <div>
              <h3 className="text-xl mb-3" style={{ fontFamily: 'var(--font-heading)', fontWeight: 500 }}>
                Contact
              </h3>
              <p className="text-[15px] text-gray-warm leading-[1.9]">
                For privacy-related inquiries, please contact us at {contactInfo.email} or write to us at {contactInfo.address}.
              </p>
            </div>
            <p className="text-[13px] text-gray-soft italic">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </AnimatedReveal>
      </div>
    </section>
  )
}
