import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../data/websiteContent';
import { Clock, Calendar, ArrowRight, BookOpen } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredPosts = BLOG_POSTS.filter((post) => {
    if (selectedCategory === 'all') return true;
    return post.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div className="pt-28 pb-20 bg-[#F8FAFC] dark:bg-[#0B1020] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Header */}
      <section className="relative py-16 lg:py-20 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 uppercase tracking-widest mb-3">
              Knowledge Base & Insights
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold font-heading text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
              Engineering Notes, <br />
              <span className="gradient-text">SEO Algorithms & Digital Strategy.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Technical blueprints, algorithm breakdown analyses, and conversion optimization insights written directly by the engineering and SEO team at Genmax IT Solution.
            </p>
          </div>

          {/* Categories */}
          <div className="mt-10 flex flex-wrap gap-2 pt-6 border-t border-slate-200 dark:border-slate-800/80">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-cyan-400 font-semibold border border-indigo-200 dark:border-cyan-500/30 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
              }`}
            >
              All Articles ({BLOG_POSTS.length})
            </button>
            <button
              onClick={() => setSelectedCategory('seo')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === 'seo'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-cyan-400 font-semibold border border-indigo-200 dark:border-cyan-500/30 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
              }`}
            >
              Local & Technical SEO
            </button>
            <button
              onClick={() => setSelectedCategory('development')}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedCategory === 'development'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-cyan-400 font-semibold border border-indigo-200 dark:border-cyan-500/30 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
              }`}
            >
              Web Architecture & Code
            </button>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="rounded-2xl p-7 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-indigo-400 dark:hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4">
                    <span className="text-indigo-600 dark:text-cyan-400 font-semibold">{post.category}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors leading-snug">
                    <Link to={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    <span className="text-slate-900 dark:text-slate-300 font-medium">{post.author.name}</span>
                    <span className="block text-[10px] text-slate-400 dark:text-slate-500">{post.publishedDate}</span>
                  </div>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:text-indigo-700 dark:hover:text-cyan-300 transition-colors"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
