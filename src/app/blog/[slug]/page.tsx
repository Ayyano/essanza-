'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, User, Tag, ArrowLeft, Share2, Clock, Heart } from 'lucide-react';
import { blogPosts } from '@/lib/blog';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const post = useMemo(() => blogPosts.find((p) => p.slug === slug), [slug]);
  const relatedPosts = useMemo(
    () => blogPosts.filter((p) => p.slug !== slug && p.tags.some((t) => post?.tags.includes(t))).slice(0, 3),
    [slug, post]
  );

  if (!post) {
    return (
      <div className="min-h-screen py-24 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold text-matte-black mb-3">Post Not Found</h1>
          <p className="text-sm text-gray-400 mb-6">Yeh blog post abhi available nahi hai</p>
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-muted-gold-dark hover:text-muted-gold transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-matte-black transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-soft-beige text-[11px] font-medium text-muted-gold-dark">
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-matte-black leading-tight mb-4">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-8 pb-6 border-b border-brand-100">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              4 min read
            </span>
          </div>

          <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-soft-beige mb-8">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed space-y-5">
            <p className="text-lg text-matte-black font-light leading-relaxed">{post.excerpt}</p>

            <p>
              ESSANZA mein aap ka swagat hai! Aaj hum baat karein ge style, fashion, aur trends ke baare mein. 
              Chahe aap lawn ki baat karein, ya shaadi ki tyari ki, ESSANZA ke paas aap ke liye kuch na kuch hai.
            </p>

            <h2 className="text-xl font-heading font-bold text-matte-black mt-8 mb-4">Style Tips Jo Aap Ko Alag Karein</h2>

            <p>
              Fashion sirf kapray pehnay ka naam nahi hai — ye aap ki personality ka expression hai. 
              ESSANZA ka maanna hai ke har outfit ek kahani sunata hai. Chahe aap unstitched lawn pehnein ya ready-to-wear suit, 
              har kapray mein ek jazba hai.
            </p>

            <p>
              Pakistani fashion duniya bhar mein apni alag pehchan rakhta hai. Embroidery, fabric quality, aur designs — sab mein 
              ek distinct flavour hai jo sirf Pakistanio ke paas hai. ESSANZA is legacy ko aage le kar jaa raha hai apne premium collection ke saath.
            </p>

            <h2 className="text-xl font-heading font-bold text-matte-black mt-8 mb-4">Perfect Outfit Kaise Choose Karein</h2>

            <p>
              Perfect outfit choose karna ek art hai. Sab se pehle, occasion ko dekhein. Shaadi ke liye heavy embroidered suit, 
              office ke liye formal wear, aur casual outings ke liye lawn ya ready-to-wear. ESSANZA ke paas har occasion ke liye kuch na kuch hai.
            </p>

            <p>
              Fabric quality bhi bohot important hai. Summer mein light fabrics jaise lawn aur chiffon, winter mein warmer fabrics. 
              ESSANZA ke saath, har season mein aap stylish reh sakte hain.
            </p>

            <h2 className="text-xl font-heading font-bold text-matte-black mt-8 mb-4">Accessories Se Look Complete Karein</h2>

            <p>
              Aksar hum kapron par toh dhyan dete hain lekin accessories bhool jaate hain. Accessories aap ke poore look ko 
              change kar sakte hain. Scarves, jewelry, handbags, belts — ye choti cheezein bada farak daalti hain. 
              ESSANZA ke accessories collection se apne outfit ko complete karein.
            </p>
          </div>

          <div className="mt-10 pt-6 border-t border-brand-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted-gold/10 flex items-center justify-center">
                <User className="h-4 w-4 text-muted-gold-dark" />
              </div>
              <div>
                <p className="text-sm font-medium text-matte-black">{post.author}</p>
                <p className="text-xs text-gray-400">ESSANZA Style Desk</p>
              </div>
            </div>
            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-muted-gold-dark transition-colors">
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </motion.article>

        {relatedPosts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h2 className="text-xl font-heading font-bold text-matte-black mb-6">Related Posts</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((rp) => (
                <Link key={rp.id} href={`/blog/${rp.slug}`} className="group">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-soft-beige mb-3">
                    <img src={rp.image} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <p className="text-[11px] text-gray-400 mb-1">{new Date(rp.date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}</p>
                  <h3 className="text-sm font-heading font-bold text-matte-black group-hover:text-muted-gold-dark transition-colors line-clamp-2">{rp.title}</h3>
                </Link>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
