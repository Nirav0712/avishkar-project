'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

import { blogPosts, BlogPost } from '@/lib/blog';

export default function BlogPostPage() {
    const params = useParams();
    const postId = Number(params.id);
    const post = blogPosts.find(p => p.id === postId);

    if (!post) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-secondary mb-4">Blog Post Not Found</h1>
                        <Link href="/blog" className="text-primary hover:text-primary-dark">
                            ← Back to Blog
                        </Link>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

            <Header />

            {/* Hero Section */}
            <section className="relative h-96 bg-secondary">
                <div className="absolute inset-0">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover opacity-40"
                    />
                </div>
                <div className="relative h-full flex items-center justify-center text-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <span className="inline-block bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                                {post.category}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
                            <div className="flex items-center justify-center gap-6 text-white/90">
                                <div className="flex items-center gap-2">
                                    <i className="fas fa-user"></i>
                                    <span>{post.author}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <i className="fas fa-calendar"></i>
                                    <span>{post.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <i className="fas fa-clock"></i>
                                    <span>{post.readTime}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Blog Content */}
            <article className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Back Link */}
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark mb-8 font-medium"
                        >
                            <i className="fas fa-arrow-left"></i>
                            Back to Blog
                        </Link>

                        {/* Content */}
                        <div className="prose prose-lg max-w-none">
                            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {post.content}
                            </div>
                        </div>

                        {/* Share Section */}
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <h3 className="text-xl font-semibold text-secondary mb-4">Share this article</h3>
                            <div className="flex gap-3">
                                <button className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                                    <i className="fab fa-facebook-f"></i>
                                </button>
                                <button className="w-12 h-12 bg-blue-400 text-white rounded-lg flex items-center justify-center hover:bg-blue-500 transition-colors">
                                    <i className="fab fa-twitter"></i>
                                </button>
                                <button className="w-12 h-12 bg-blue-700 text-white rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors">
                                    <i className="fab fa-linkedin-in"></i>
                                </button>
                                <button className="w-12 h-12 bg-green-600 text-white rounded-lg flex items-center justify-center hover:bg-green-700 transition-colors">
                                    <i className="fab fa-whatsapp"></i>
                                </button>
                            </div>
                        </div>

                        {/* Author Bio */}
                        <div className="mt-12 p-6 bg-gray-50 rounded-xl">
                            <div className="flex items-start gap-4">
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                    <i className="fas fa-user text-3xl text-primary"></i>
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold text-secondary mb-2">{post.author}</h4>
                                    <p className="text-gray-600">
                                        Real estate expert and content writer with over 10 years of experience in the Indian property market.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </article>

            {/* Related Posts */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-secondary mb-8 text-center">Related Articles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {blogPosts
                            .filter(p => p.id !== postId && p.category === post.category)
                            .slice(0, 3)
                            .map(relatedPost => (
                                <Link
                                    key={relatedPost.id}
                                    href={`/blog/${relatedPost.id}`}
                                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group"
                                >
                                    <div className="relative h-48">
                                        <Image
                                            src={relatedPost.image}
                                            alt={relatedPost.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-semibold text-secondary mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                            {relatedPost.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 line-clamp-2">{relatedPost.excerpt}</p>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
