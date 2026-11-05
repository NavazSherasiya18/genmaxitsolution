import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { BLOG_POSTS } from '../data/websiteContent';
import { ArrowLeft, Clock, Calendar, ChevronRight, Share2, ArrowRight } from 'lucide-react';

interface BlogPostPageProps {
  onOpenAudit: () => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ onOpenAudit }) => {
  const { slug } = useParams<{ slug: string }>();
  const [readingProgress, setReadingProgress] = useState(0);

  const post = BLOG_POSTS.find((p) => p.slug === slug);

  useEffect(() => {
    const updateProgress = () => {
      const currentScroll = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight) {
        setReadingProgress(Number((currentScroll / scrollHeight).toFixed(2)) * 100);
      }
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const relatedPosts = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 2);

  return (
    <div className="pt-28 pb-20 bg-[#F8FAFC] dark:bg-[#0B1020] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-indigo-600 to-cyan-500 transition-all duration-100"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Breadcrumb */}
      <div className="border-b border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link to="/" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
          <Link to="/blog" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Blog</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
          <span className="text-indigo-600 dark:text-cyan-400 font-medium truncate">{post.title}</span>
        </div>
      </div>

      {/* Article Header */}
      <header className="py-16 border-b border-slate-200 dark:border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4">
            <span className="text-indigo-600 dark:text-cyan-400 font-semibold">{post.category}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTime}</span>
            </span>
            <span>·</span>
            <span>{post.publishedDate}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-indigo-600 dark:text-cyan-400 font-heading">
              {post.author.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">{post.author.name}</div>
              <div className="text-slate-500 dark:text-slate-400">{post.author.role}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Article Body */}
      <article className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-base text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
          {/* Intro callout */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-lg leading-relaxed font-medium shadow-xs">
            {post.content.intro}
          </div>

          {/* Body Sections */}
          {post.content.sections.map((section, idx) => (
            <div key={idx} className="space-y-3 pt-4">
              <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                {section.heading}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {section.body}
              </p>
            </div>
          ))}

          {/* Conclusion */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-2">
              Strategic Takeaway
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {post.content.conclusion}
            </p>
          </div>

          {/* In-Article Consultation Card */}
          <div className="p-8 rounded-2xl bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-slate-900 dark:to-[#0F172A] border border-indigo-200 dark:border-cyan-500/30 shadow-md my-10">
            <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-2">
              Ready to Implement These Findings in Your Business?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6">
              Our engineering and SEO specialists can perform a full audit on your digital assets and craft a custom growth roadmap.
            </p>
            <button
              onClick={onOpenAudit}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold text-xs tracking-wider uppercase hover:opacity-95 shadow-md transition-all cursor-pointer"
            >
              Request Free Consultation
            </button>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      <section className="py-16 border-t border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-6">
            Continue Reading
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedPosts.map((rel) => (
              <Link
                key={rel.id}
                to={`/blog/${rel.slug}`}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-cyan-500/50 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="text-[10px] font-semibold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider mb-2">
                    {rel.category}
                  </div>
                  <h4 className="text-base font-bold font-heading text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors mb-2">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {rel.excerpt}
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-1.5 text-xs text-indigo-600 dark:text-cyan-400 font-semibold">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
