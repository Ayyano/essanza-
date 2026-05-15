import { ShieldAlert, RefreshCw, Clock, MessageCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { SITE_INFO } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns & Exchanges',
  description: 'ESSANZA 7-day return and exchange policy. Learn about our easy return process, conditions, and COD refund information.',
};

const sections = [
  {
    icon: RefreshCw,
    title: '7-Day Return Policy',
    content: 'ESSANZA offers a 7-day return and exchange policy from the date of delivery. Agar aap ko apne product mein koi issue hai — size issue ho, defect ho, ya aap ko product pasand nahi aaya — toh aap hum se 7 din ke andar contact kar sakte hain. Product original condition mein hona chahiye, with all tags attached and packaging intact. Hum aap ke liye pickup arrange karein ge aur replacement ya refund process karein ge.',
  },
  {
    icon: CheckCircle2,
    title: 'Conditions for Returns',
    content: 'Returns sirf un products ke liye acceptable hain jo original condition mein hain. Product ke saath all tags, packaging, aur invoice hona zaroori hai. Agar product use kiya gaya ho, washed kiya gaya ho, ya damaged ho (aap ki taraf se), toh return accept nahi kiya jaaye ga. Sale items aur final sale products par return policy apply nahi hoti. Undergarments, cosmetics (if used), aur personalized items return nahi kiye ja sakte.',
    list: [
      'Product original packaging aur tags ke saath ho',
      'Product use ya washed na kiya gaya ho',
      'Invoice ya order confirmation available ho',
      '7 din ke andar return request ki gayi ho',
    ],
  },
  {
    icon: ArrowLeft,
    title: 'Return Process',
    content: 'Return process bohot simple hai. Pehle humein WhatsApp ya email karein apna order number aur issue ke saath. Hum aap ko return authorization provide karein ge. Phir hum pickup arrange karein ge (delivery charges applicable in some cases). Product humein milne ke baad, hum quality check karein ge. Check clear hone ke baad, hum replacement dispatch karein ge ya refund process karein ge.',
    steps: [
      'WhatsApp par 7440046103 par message karein apna order ID aur issue',
      'Hum aap ko return confirmation dein ge within 24 hours',
      'Pickup arrange kiya jaaye ga (usually 1-2 working days)',
      'Product received hone ke baad quality check (2-3 working days)',
      'Replacement dispatch ya refund initiated',
    ],
  },
  {
    icon: Clock,
    title: 'COD Refund Information',
    content: 'Cash on Delivery orders ke liye refund process thoda different hai. Hum aap ka refund Easypaisa, JazzCash, ya bank transfer ke through karein ge. Refund process mein 5-7 working days lag sakte hain. COD ke liye delivery charges (if any) refundable nahi hain. Replacement orders mein shipping charges ESSANZA bear kare ga agar defect ESSANZA ki taraf se ho.',
  },
  {
    icon: MessageCircle,
    title: 'Contact for Returns',
    content: `Return aur exchange ke liye humein in zariye se contact karein:`,
    contacts: [
      { label: 'WhatsApp', value: SITE_INFO.whatsapp, href: `https://wa.me/${SITE_INFO.whatsapp.replace(/[^0-9]/g, '')}` },
      { label: 'Email', value: SITE_INFO.email, href: `mailto:${SITE_INFO.email}` },
    ],
  },
];

export default function ReturnsPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-muted-gold-dark font-medium">Policy</span>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-matte-black mt-3 mb-2">Returns & Exchanges</h1>
          <p className="text-gray-400 italic text-sm">Aap ki satisfaction humari priority hai</p>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <div
              key={section.title}
              className="bg-white rounded-2xl border border-brand-100 p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-muted-gold/10 flex items-center justify-center shrink-0">
                  <section.icon className="h-5 w-5 text-muted-gold-dark" />
                </div>
                <h2 className="text-lg font-heading font-bold text-matte-black">{section.title}</h2>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{section.content}</p>

              {'list' in section && section.list && (
                <ul className="space-y-2">
                  {section.list.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-gold mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {'steps' in section && section.steps && (
                <div className="space-y-3 mt-2">
                  {section.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-muted-gold/10 text-muted-gold-dark text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-sm text-gray-500">{step}</p>
                    </div>
                  ))}
                </div>
              )}

              {'contacts' in section && section.contacts && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {section.contacts.map((contact) => (
                    <a
                      key={contact.label}
                      href={contact.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-soft-beige text-sm font-medium text-matte-black hover:bg-brand-200 transition-colors"
                    >
                      {contact.value}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 bg-amber-50/50 border border-amber-200/50 rounded-2xl p-6 text-center">
          <ShieldAlert className="h-6 w-6 text-amber-500 mx-auto mb-2" />
          <p className="text-sm text-amber-800 font-medium">Important Note</p>
          <p className="text-xs text-amber-600/70 mt-1">
            Sale items, clearance products, aur personalized items return nahi kiye ja sakte. 
            Agar aap ko koi confusion ho toh humein WhatsApp par contact karein.
          </p>
        </div>
      </div>
    </div>
  );
}
