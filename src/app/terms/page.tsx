import { FileText, ShoppingBag, CreditCard, Truck, Shield, Ban, AlertTriangle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'ESSANZA terms and conditions. Understand your rights and obligations when using ESSANZA.pk ecommerce platform.',
};

const sections = [
  {
    icon: FileText,
    title: 'Introduction',
    content: 'Welcome to ESSANZA (essanza.pk). Yeh terms aur conditions aap ke aur ESSANZA ke darmiyan agreement ko represent karte hain. Website ya services use karke aap in terms se agree karte hain. Agar aap in terms se agree nahi karte, toh website use na karein.',
  },
  {
    icon: ShoppingBag,
    title: 'Products & Pricing',
    content: 'ESSANZA par dikhaye gaye products aur pricing subject to change hain. Hum accurate product descriptions aur pricing ensure karne ki koshish karte hain, lekin errors ho sakte hain. Agar koi pricing error ho toh hum order cancel karne ka right reserve karte hain. Prices Pakistani Rupees (Rs./PKR) mein hain.',
    items: [
      'All prices include applicable taxes',
      'Product colors may vary slightly due to screen settings',
      'Stock availability is subject to change',
      'We reserve the right to modify prices without prior notice',
    ],
  },
  {
    icon: CreditCard,
    title: 'Payment Terms',
    content: 'Hum Cash on Delivery (COD), Bank Transfer, Easypaisa, JazzCash, aur online payment accept karte hain. COD payments delivery ke waqt cash mein ki jayen. Online payments secure payment gateway ke through process hoti hain. Payment confirmation ke baad hi order process kiya jaaye ga.',
  },
  {
    icon: Truck,
    title: 'Shipping & Delivery',
    content: 'ESSANZA entire Pakistan mein delivery provide karta hai. Delivery times city ke hisaab se vary karte hain: Karachi/Lahore/Islamabad (2-3 days), other cities (4-7 days). Orders above Rs. 3,000 ki free shipping hai. Delivery charges non-refundable hain. Risk of loss product deliver hone ke baad aap ko transfer ho jata hai.',
  },
  {
    icon: Shield,
    title: 'Returns & Refunds',
    content: 'Detailed return policy humari Returns page par available hai. Briefly: 7-day return policy applies. Products must be in original condition. Refunds are processed within 5-7 working days after quality check. Sale items may have different return conditions.',
  },
  {
    icon: Ban,
    title: 'Prohibited Uses',
    content: 'Aap ESSANZA website ko sirf lawful purposes ke liye use kar sakte hain. Prohibited activities include:',
    items: [
      'Fraudulent orders ya fake information submit karna',
      'Website security ko compromise karna',
      'Intellectual property rights violate karna',
      'Harassment ya abusive behavior',
      'Misuse of discount codes or promotions',
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Limitation of Liability',
    content: 'Kisi bhi had tak ESSANZA liable nahi hoga for indirect, incidental, ya consequential damages. Humari total liability aap ke order ki value se zyada nahi ho gi. Yeh limitation applicable law ke under enforce ho gi.',
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-muted-gold-dark font-medium">Legal</span>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-matte-black mt-3 mb-2">Terms & Conditions</h1>
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

        <div className="mt-10 bg-soft-beige/50 rounded-2xl p-6 text-center">
          <p className="text-sm text-gray-500 italic">
            ESSANZA is a registered brand in Pakistan. All rights reserved. Disputes subject to Karachi jurisdiction.
          </p>
        </div>
      </div>
    </div>
  );
}
