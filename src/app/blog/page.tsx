'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, Calendar, User, ArrowRight, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { blogPosts } from '@/lib/blog';
import { Button } from '@/components/ui';

const allTags = Array.from(new Set(blogPosts.flatMap((p) => p.tags)));

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
} as const;

export default function BlogPage() {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    let posts = blogPosts;
    if (activeTag) posts = posts.filter((p) => p.tags.includes(activeTag));
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      posts = posts.filter((p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q));
    }
    return posts;
  }, [activeTag, searchQuery]);

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-muted-gold-dark font-medium">Style Journal</span>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-matte-black mt-3 mb-2">The ESSANZA Blog</h1>
          <p className="text-gray-400 italic text-sm">Style tips, trends, aur stories — sab kuch ESSANZA ke saath</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-8 max-w-md mx-auto"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blog posts..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-brand-200 bg-white text-matte-black focus:outline-none focus:ring-2 focus:ring-muted-gold focus:border-transparent transition-all text-sm"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-2 justify-center mb-10"
        >
          <button
            onClick={() => setActiveTag(null)}
            className={cn(
              'px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 border',
              !activeTag
                ? 'bg-matte-black text-warm-white border-matte-black'
                : 'bg-white text-gray-500 border-brand-200 hover:text-matte-black hover:border-matte-black'
            )}
          >
            All Posts
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={cn(
                'px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 border',
                activeTag === tag
                  ? 'bg-matte-black text-warm-white border-matte-black'
                  : 'bg-white text-gray-500 border-brand-200 hover:text-matte-black hover:border-matte-black'
              )}
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Tag className="h-10 w-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">Koi post nahi mili</p>
            <p className="text-xs text-gray-300 mt-1 italic">Kuch aur search karein ya tag change karein</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((post) => (
              <motion.article key={post.id} variants={itemVariants}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-soft-beige mb-4">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </span>
                  </div>
                  <h2 className="text-base font-heading font-bold text-matte-black leading-snug group-hover:text-muted-gold-dark transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">{post.excerpt}</p>
                  <div className="flex items-center gap-1.5">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-[10px] uppercase tracking-wider text-muted-gold-dark font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-matte-black mt-3 group-hover:text-muted-gold-dark transition-colors">
                    Read More <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
