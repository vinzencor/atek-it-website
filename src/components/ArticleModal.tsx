import React, { useEffect } from 'react';
import { X, Calendar, User, Tag, Clock } from 'lucide-react';

export interface Article {
  title: string;
  category: string;
  categoryColor: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  image?: string;
}

interface ArticleModalProps {
  article: Article;
  isOpen: boolean;
  onClose: () => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ article, isOpen, onClose }) => {
  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8 animate-fade-in-up">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <div className={`px-3 py-1 bg-${article.categoryColor}-100 rounded-full`}>
                <span className={`text-xs font-semibold text-${article.categoryColor}-700`}>
                  {article.category}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8">
          {/* Article Image */}
          {article.image && (
            <div className="mb-6 rounded-xl overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-64 sm:h-80 object-cover"
              />
            </div>
          )}

          {/* Article Title */}
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h2>

          {/* Article Meta Information */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8 pb-6 border-b border-gray-200">
            <div className="flex items-center space-x-2 text-gray-600">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">{article.author}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{article.date}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{article.readTime}</span>
            </div>
          </div>

          {/* Article Excerpt */}
          <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border-l-4 border-primary-600">
            <p className="text-lg text-gray-700 italic leading-relaxed">
              {article.excerpt}
            </p>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-8">
            <div className="text-gray-700 leading-relaxed space-y-4">
              {article.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-base sm:text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Article Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-start space-x-3">
                <Tag className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-8 p-6 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl border border-primary-200">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Want to Learn More?
            </h3>
            <p className="text-gray-700 mb-4">
              Get in touch with our experts to discuss how we can help transform your business with cutting-edge technology solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Contact Us
              </a>
              <a
                href="/insights"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-all duration-300"
              >
                More Insights
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;

