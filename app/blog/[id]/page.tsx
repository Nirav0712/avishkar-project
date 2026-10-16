'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Information from '../../components/Information';
import { blogPosts } from '@/lib/blog';

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const postId = Number(resolvedParams.id);
  const post = blogPosts.find(p => p.id === postId);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col">
        <Header />
        <div className="flex-1 max-w-lg mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-slate-800">Article Not Found</h1>
          <p className="text-sm text-slate-500 mt-2">
            The market report you are looking for may have been moved or updated.
          </p>
          <Link
            href="/blog"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0b1528] text-white text-xs font-bold"
          >
            ← Back to Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedPosts = blogPosts.filter(p => p.id !== postId).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col">
      <Header />

      {/* Hero Cover */}
      <section className="bg-gradient-to-r from-[#0b1528] via-[#102447] to-[#0b1528] text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <span className="inline-block bg-[#d4af37] text-[#0b1528] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            {post.category}
          </span>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-center gap-4 text-xs text-slate-300 mt-6 flex-wrap">
            <span className="flex items-center gap-1.5">
              <i className="fas fa-user-edit text-[#e4c272]"></i>
              <span>{post.author}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <i className="far fa-calendar-alt text-[#e4c272]"></i>
              <span>{post.date}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <i className="far fa-clock text-[#e4c272]"></i>
              <span>{post.readTime || '5 min read'}</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Article Body */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1 w-full">
        {/* Featured Image */}
        <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden shadow-xl mb-10 border border-slate-200">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article Text Content */}
        <article className="bg-white/90 backdrop-blur-md rounded-3xl border border-white/80 p-6 sm:p-12 shadow-sm prose prose-slate max-w-none">
          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed mb-6 italic border-l-4 border-[#d4af37] pl-4">
            {post.excerpt}
          </p>

          <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-5 whitespace-pre-line font-light">
            {post.content}
          </div>

          {/* Social Share & Consultation CTA */}
          <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Have questions regarding this project?
              </span>
              <p className="text-sm font-bold text-[#0b1528]">
                Get verified RERA consultation & floor plans from our experts.
              </p>
            </div>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full bg-[#0b1528] hover:bg-[#162544] text-[#e4c272] text-xs font-bold tracking-wide transition-all shadow-md shrink-0"
            >
              Enquire About This Project
            </Link>
          </div>
        </article>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-xl font-bold text-slate-900 mb-6">More Market Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map(p => (
                <Link
                  key={p.id}
                  href={`/blog/${p.id}`}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all p-4 group"
                >
                  <div className="relative h-36 rounded-xl overflow-hidden mb-3">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <span className="text-[10px] font-bold text-[#d4af37] uppercase">{p.category}</span>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 mt-1 group-hover:text-[#d4af37] transition-colors">
                    {p.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Information />
      <Footer />
    </div>
  );
}
