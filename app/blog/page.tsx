'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

import { blogPosts, BlogPost } from '@/lib/blog';

export default function BlogPage() {
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Project Spotlight', 'Market Trends', 'Finance', 'Buying Guide', 'Investment', 'Location Guide', 'Legal', 'Technology', 'Commercial', 'Design'];

    const filteredPosts = selectedCategory === 'All'
        ? blogPosts
        : blogPosts.filter(post => post.category === selectedCategory);

    return (
        <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

            <Header />

            {/* Hero Section */}
            <section className="relative bg-linear-to-br from-[#0f1f3d] to-[#0f1f3d] text-white py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">Blogs</h1>
                        <p className="text-xl md:text-2xl opacity-95">
                            Stay updated with the latest trends, tips, and insights from India's real estate market
                        </p>
                    </div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 bg-white border-b border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-2 rounded-full font-medium transition-all ${selectedCategory === category
                                    ? 'bg-[#0f1e3d] text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-[#0f1e3d] hover:text-[#e4c272] transition-colors'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog Posts Grid */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post) => (
                            <article key={post.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group">
                                {/* Image */}
                                <div className="relative h-56 overflow-hidden">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-[#e4c272] text-[#0f1e3d] px-3 py-1 rounded-full text-xs font-semibold">
                                            {post.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Meta */}
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                        <div className="flex items-center gap-1">
                                            <i className="fas fa-user text-[#e4c272]"></i>
                                            <span>{post.author}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <i className="fas fa-clock text-[#e4c272]"></i>
                                            <span>{post.readTime}</span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-xl font-bold text-[#0f1e3d] mb-3 line-clamp-2 group-hover:text-[#e4c272] transition-colors">
                                        {post.title}
                                    </h2>

                                    {/* Excerpt */}
                                    <p className="text-gray-600 mb-4 line-clamp-3">
                                        {post.excerpt}
                                    </p>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                        <span className="text-sm text-gray-500">{post.date}</span>
                                        <Link
                                            href={`/blog/${post.id}`}
                                            className="text-[#e4c272] font-medium hover:text-[#0f1e3d] transition-colors flex items-center gap-2"
                                        >
                                            Read More
                                            <i className="fas fa-arrow-right"></i>
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {filteredPosts.length === 0 && (
                        <div className="text-center py-20">
                            <i className="fas fa-blog text-6xl text-gray-300 mb-4"></i>
                            <p className="text-xl text-gray-500">No posts found in this category</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-16 bg-[#12233D] text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#e4c272]">Subscribe to Our Newsletter</h2>
                        <p className="text-lg mb-8 opacity-90">
                            Get the latest real estate insights delivered directly to your inbox
                        </p>
                        <form className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-6 py-4 rounded-lg text-white border border-[#e4c272]/20 focus:outline-none focus:ring-2 focus:ring-[#e4c272]/20"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-prmaryi text-[#e4c272] border border-[#e4c272] px-8 py-4 rounded-lg font-semibold hover:bg-[#e4c272] hover:text-[#12233D] transition-colors"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
