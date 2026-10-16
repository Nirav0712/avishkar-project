'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Information from '../components/Information';
import { blogPosts } from '@/lib/blog';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Project Spotlight', 'Market Trends', 'Buying Guide', 'Investment', 'Location Guide'];

  const filteredPosts = selectedCategory === 'All'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory || (selectedCategory === 'Project Spotlight' && post.category?.includes('Project')));

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col">
      <Header />

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#0b1528] via-[#102447] to-[#0b1528] text-white py-16 sm:py-24 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#e4c272] text-xs font-bold uppercase tracking-widest mb-3">
            <i className="fas fa-newspaper text-xs"></i>
            <span>Real Estate Insights</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto">
            Ahmedabad Market <span className="gold-gradient-text">Trends & Project Reviews</span>
          </h1>

          <p className="mt-4 text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            In-depth analysis, RERA updates, pricing benchmarks, and developer spotlight reports by Avishkar Realty researchers.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-[#d4af37] text-[#0b1528] shadow-md shadow-[#d4af37]/30"
                    : "bg-white/10 text-slate-200 hover:bg-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Cards Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 flex-1 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white/85 backdrop-blur-md border border-white/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  <span className="absolute top-4 left-4 bg-[#0b1528]/85 backdrop-blur-sm text-[#e4c272] border border-[#d4af37]/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {post.category}
                  </span>

                  <span className="absolute bottom-3 right-4 text-xs text-white/90 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                    {post.readTime || '4 min read'}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                    <i className="far fa-calendar-alt text-[#d4af37]"></i>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>By {post.author}</span>
                  </div>

                  <Link href={`/blog/${post.id}`}>
                    <h2 className="font-bold text-lg text-slate-900 group-hover:text-[#d4af37] transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="mt-3 text-xs sm:text-sm text-slate-600 line-clamp-3 font-light leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-0">
                <Link
                  href={`/blog/${post.id}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#0b1528] group-hover:text-[#d4af37] transition-colors"
                >
                  <span>Read Full Article</span>
                  <i className="fas fa-arrow-right text-[10px] transform group-hover:translate-x-1 transition-transform"></i>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Information />
      <Footer />
    </div>
  );
}
