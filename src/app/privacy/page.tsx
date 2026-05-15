import { Shield, Lock, Eye, Database, Mail, FileText } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'ESSANZA privacy policy. Learn how we collect, use, and protect your personal information in compliance with Pakistani law.',
};

const sections = [
  {
    icon: Shield,
    title: 'Introduction',
    content: 'ESSANZA (essanza.pk) aap ki privacy ko bohat ehemiyat deta hai. Yeh privacy policy batati hai ke hum aap ki personal information kaise collect karte hain, use karte hain, aur protect karte hain. ESSANZA website aur services use karke aap is policy se agree karte hain.',
  },
  {
    icon: Database,
    title: 'Information We Collect',
    content: 'Hum aap se kuch information collect karte hain jab aap website use karte hain, order karte hain, account banate hain, ya hum se contact karte hain.',
    items: [
      'Personal identification info: naam, email address, phone number, shipping address',
      'Order information: products you buy, payment method, order history',
      'Communication: aap ke messages, reviews, aur support requests',
      'Technical data: IP address, browser type, device info, cookies',
    ],
  },
  {
    icon: Eye,
    title: 'How We Use Your Information',
    content: 'Aap ki information hum sirf legitimate purposes ke liye use karte hain:',
    items: [
      'Orders process karne aur deliver karne ke liye',
      'Customer support provide karne ke liye',
      'Website improve karne ke liye',
      'Marketing communications (with your consent)',
      'Fraud prevention aur legal compliance',
    ],
  },
  {
    icon: Lock,
    title: 'Data Protection',
    content: 'Hum aap ki information ki security ke liye industry-standard measures use karte hain. SSL encryption, secure servers, aur restricted access ensure karte hain ke aap ka data safe hai. Hum aap ki information third parties ko sell nahi karte. Sirf trusted service providers (delivery companies, payment processors) ke saath share karte hain jo privacy standards follow karte hain.',
  },
  {
    icon: FileText,
    title: 'Your Rights',
    content: 'Aap ko haq hai:',
    items: [
      'Apni personal information access karne ka',
      'Information correct karwane ka',
      'Information delete karwane ka (subject to legal obligations)',
      'Marketing communications se opt-out karne ka',
      'Data portability ka',
    ],
  },
  {
    icon: Mail,
    title: 'Contact Us',
    content: 'Privacy policy ke baare mein koi sawaal ho toh humein email karein: essenza0055@gmail.com. Ya WhatsApp par 7440046103 par message karein. Hum 24 ghanton mein jawaab denge.',
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-muted-gold-dark font-medium">Legal</span>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-matte-black mt-3 mb-2">Privacy Policy</h1>
          <p className="text-gray-400 italic text-sm">Last updated: May 2026</p>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="bg-white rounded-2xl border border-brand-100 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-muted-gold/10 flex items-center justify-center shrink-0">
                  <section.icon className="h-5 w-5 text-muted-gold-dark" />
                </div>
                <h2 className="text-lg font-heading font-bold text-matte-black">{section.title}</h2>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{section.content}</p>
              {'items' in section && section.items && (
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-gold mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-xs text-gray-300 italic">
            This privacy policy is compliant with Pakistani data protection laws, including the Prevention of Electronic Crimes Act 2016 (PECA).
          </p>
        </div>
      </div>
    </div>
  );
}
