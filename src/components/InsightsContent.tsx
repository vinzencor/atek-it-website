import React, { useEffect, useRef, useState } from 'react';
import {
  BookOpen, TrendingUp, Cloud, Code, BarChart3, Lightbulb,
  Download, Mail, ArrowRight, Star, Target, Zap, Settings,
  Database, Globe, Users, FileText, CheckCircle, Sparkles,
  Brain, Network, Shield, Activity, Loader2
} from 'lucide-react';
import { AuroraBackground } from './ui/aurora-background';
import { initSmoothAnimations, cleanupAnimations } from '../utils/smoothAnimations';
import { getGuides, type DownloadableGuide } from '../utils/guides';

const InsightsContent = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [newsletterData, setNewsletterData] = useState({
    fullName: '',
    email: ''
  });
  const [guides, setGuides] = useState<DownloadableGuide[]>([]);
  const [isLoadingGuides, setIsLoadingGuides] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const observer = initSmoothAnimations(sectionRef.current);
    return () => cleanupAnimations(observer);
  }, []);

  // Fetch guides from CMS
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setIsLoadingGuides(true);
        const fetchedGuides = await getGuides();
        setGuides(fetchedGuides);
      } catch (error) {
        console.error('Error fetching guides:', error);
      } finally {
        setIsLoadingGuides(false);
      }
    };

    fetchGuides();
  }, []);

  // Handle newsletter form input changes
  const handleNewsletterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewsletterData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Newsletter form validation
  const validateNewsletterForm = () => {
    const newErrors: Record<string, string> = {};

    if (!newsletterData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!newsletterData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle newsletter form submission
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateNewsletterForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for submission
      const submitData = new FormData();
      submitData.append('fullName', newsletterData.fullName);
      submitData.append('email', newsletterData.email);
      submitData.append('type', 'newsletter');
      submitData.append('recipients', 'dev.emildasolutions@gmail.com,info@atekit.com');

      // Simulate API call (replace with actual endpoint)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real implementation, you would send to your backend:
      // const response = await fetch('/api/newsletter', {
      //   method: 'POST',
      //   body: submitData
      // });

      setSubmitStatus('success');
      setNewsletterData({ fullName: '', email: '' });

      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);

    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whyFollowReasons = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Technology That Transforms",
      description: "We don't just write about trends—we show you how they apply to real business outcomes.",
      color: "primary"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Built for Business Leaders & Technical Teams",
      description: "Our articles bridge the gap between high-level strategy and hands-on implementation.",
      color: "secondary"
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Learn from the Field",
      description: "Content inspired by real-world client projects, product builds, and best practices.",
      color: "accent"
    }
  ];

  const consultProArticles = [
    "How PayPilot Cut Payroll Time by 90% for a 100+ Consultant Firm",
    "Integrating QuickBooks and Zoho with PayPilot: What You Need to Know",
    "Best Practices for Time Tracking in Consulting Operations"
  ];

  const cloudDevOpsArticles = [
    "Choosing Between AWS, Azure, and GCP for Your Mid-Sized Business",
    "Implementing Infrastructure-as-Code with Terraform & Ansible",
    "Kubernetes vs. Docker Swarm: What Works Best in 2025?"
  ];

  const saasArticles = [
    "5 SaaS Design Decisions That Make or Break Scale",
    "How to Build a Multi-Tenant SaaS App from Day One",
    "Understanding SaaS Product-Market Fit for B2B Clients"
  ];

  const itStrategyArticles = [
    "The Top 7 IT Consulting Challenges in 2025 and How to Solve Them",
    "How to Choose a Technology Partner for Your Digital Transformation Project",
    "Aligning IT Strategy with Business Goals: A C-Suite Playbook"
  ];

  const analyticsAIArticles = [
    "How to Build Real-Time Dashboards That Actually Get Used",
    "Using AI to Automate Helpdesk and Infrastructure Monitoring",
    "Data Pipelines: ETL vs. ELT and When to Use Each"
  ];

  const popularDownloads = [
    {
      title: "SaaS Readiness Checklist",
      description: "For teams planning their first product launch",
      icon: <CheckCircle className="h-5 w-5" />
    },
    {
      title: "DevOps Implementation Toolkit",
      description: "Roadmap + tools for mid-sized teams",
      icon: <Settings className="h-5 w-5" />
    },
    {
      title: "Cloud Cost Optimization Guide",
      description: "Reduce AWS/Azure/GCP spend by 30%",
      icon: <Cloud className="h-5 w-5" />
    },
    {
      title: "Pay Pilot Onboarding Workbook",
      description: "Step-by-step planning sheet for new customers",
      icon: <Sparkles className="h-5 w-5" />
    }
  ];

  const topicCategories = [
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "PayPilot Use Cases",
      description: "Discover how our flagship SaaS product is helping real consulting teams save time, reduce errors, and scale operations.",
      articles: consultProArticles,
      color: "primary"
    },
    {
      icon: <Cloud className="h-8 w-8" />,
      title: "Cloud & DevOps",
      description: "From migration strategies to CI/CD pipelines and container orchestration.",
      articles: cloudDevOpsArticles,
      color: "secondary"
    },
    {
      icon: <Code className="h-8 w-8" />,
      title: "SaaS & Software Development",
      description: "Thoughtful guidance for CTOs, founders, and software leads building scalable SaaS products.",
      articles: saasArticles,
      color: "accent"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "IT Strategy & Consulting",
      description: "Insights for enterprise leaders shaping their digital roadmap.",
      articles: itStrategyArticles,
      color: "primary"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Analytics, Automation & AI",
      description: "Drive smarter business decisions with the right tools and frameworks.",
      articles: analyticsAIArticles,
      color: "secondary"
    }
  ];

  return (
    <div ref={sectionRef}>
      {/* Why Follow Our Content */}
      <section className="py-16 sm:py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary-100/50 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary-100/50 to-transparent rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="animate-on-scroll inline-flex items-center space-x-2 bg-secondary-100/80 backdrop-blur-sm border border-secondary-200/50 rounded-full px-4 sm:px-6 py-3 mb-6">
              <Star className="h-4 w-4 text-secondary-600" />
              <span className="text-xs sm:text-sm font-semibold text-secondary-700">Why Follow Our Content?</span>
            </div>

            <h2 className="animate-on-scroll text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 px-2 sm:px-0">
              Expert Insights <span className="bg-gradient-to-r from-secondary-600 to-primary-600 bg-clip-text text-transparent font-serif-display font-normal italic">That Matter</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {whyFollowReasons.map((reason, index) => (
              <div
                key={index}
                className="animate-on-scroll group relative bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-soft hover:shadow-large transition-all duration-500 hover:-translate-y-2 border border-neutral-200/50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${reason.color}-500/20 to-${reason.color}-600/20 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}></div>

                <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-${reason.color}-500 to-${reason.color}-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-medium group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 mb-6`}>
                  {reason.icon}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 group-hover:text-primary-700 transition-colors duration-300 mb-3 sm:mb-4">
                  {reason.title}
                </h3>

                <p className="text-neutral-600 leading-relaxed text-base sm:text-lg">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Topics */}
      <section id="featured-topics" className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 via-white to-secondary-50/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="animate-on-scroll inline-flex items-center space-x-2 bg-accent-100/80 backdrop-blur-sm border border-accent-200/50 rounded-full px-4 sm:px-6 py-3 mb-6">
              <TrendingUp className="h-4 w-4 text-accent-600" />
              <span className="text-xs sm:text-sm font-semibold text-accent-700">Featured Topics</span>
            </div>

            <h2 className="animate-on-scroll text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 px-2 sm:px-0">
              Latest <span className="bg-gradient-to-r from-accent-600 to-primary-600 bg-clip-text text-transparent font-serif-display font-normal italic">Articles & Insights</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {topicCategories.map((category, index, arr) => (
              <div
                key={index}
                className={[
                  "animate-on-scroll group relative bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-soft hover:shadow-large transition-all duration-500 hover:-translate-y-2 border border-neutral-200/50",
                  // if odd total and this is the last card → center it
                  arr.length % 2 !== 0 && index === arr.length - 1 ? "lg:col-span-2 lg:mx-auto lg:max-w-xl" : ""
                ].join(" ")}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${category.color}-500/20 to-${category.color}-600/20 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}></div>

                <div className="flex flex-col items-start space-y-6">
                  <div className={`w-16 h-16 bg-gradient-to-br from-${category.color}-500 to-${category.color}-600 rounded-2xl flex items-center justify-center text-white shadow-medium group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    {category.icon}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 group-hover:text-primary-700 transition-colors duration-300 mb-3 sm:mb-4">
                      {category.title}
                    </h3>

                    <p className="text-neutral-600 leading-relaxed mb-4 sm:mb-6 text-base sm:text-lg">
                      {category.description}
                    </p>

                    <div className="space-y-3">
                      {category.articles.map((article, articleIndex) => (
                        <div key={articleIndex} className="flex items-start space-x-3 group cursor-pointer">
                          <ArrowRight className={`h-5 w-5 text-${category.color}-600 mt-0.5 flex-shrink-0 group-hover:translate-x-1 transition-transform duration-300`} />
                          <span className="text-neutral-700 group-hover:text-primary-600 transition-colors duration-300 font-medium">
                            {article}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Resource Library */}
      <section id="resource-library" className="py-16 sm:py-20 bg-white relative overflow-hidden">
        <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-br from-primary-200/30 to-secondary-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-bl from-secondary-200/30 to-accent-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="animate-on-scroll inline-flex items-center space-x-2 bg-primary-100/80 backdrop-blur-sm border border-primary-200/50 rounded-full px-4 sm:px-6 py-3 mb-6">
              <Download className="h-4 w-4 text-primary-600" />
              <span className="text-xs sm:text-sm font-semibold text-primary-700">Resource Library</span>
            </div>

            <h2 className="animate-on-scroll text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 px-2 sm:px-0">
              Downloadable <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent font-serif-display font-normal italic">Guides & Toolkits</span>
            </h2>

            <p className="animate-on-scroll text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              We also offer downloadable guides, whitepapers, and toolkits designed to help you plan,
              implement, and optimize your IT operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingGuides ? (
              // Loading state
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-on-scroll bg-white rounded-xl p-6 shadow-md border border-gray-100"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mb-4 animate-pulse">
                    <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                  </div>
                  <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4 animate-pulse"></div>
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))
            ) : guides.length > 0 ? (
              // CMS guides
              guides.map((guide, index) => (
                <a
                  key={guide.slug}
                  href={guide.pdfFile}
                  download
                  className="animate-on-scroll group bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 cursor-pointer block"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={guide.icon}
                      alt={`${guide.title} icon`}
                      className="h-6 w-6 object-contain"
                      onError={(e) => {
                        // Fallback to default icon if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <FileText className="h-6 w-6 text-primary-600 hidden" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                    {guide.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{guide.description}</p>
                  <div className="flex items-center space-x-2 text-primary-600 font-medium text-sm group-hover:text-primary-700 transition-colors duration-300">
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </div>
                </a>
              ))
            ) : (
              // No guides available
              <div className="col-span-full text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Guides Available</h3>
                <p className="text-gray-600">Check back soon for downloadable guides and toolkits.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 via-white to-primary-50/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="animate-on-scroll inline-flex items-center space-x-2 bg-secondary-100/80 backdrop-blur-sm border border-secondary-200/50 rounded-full px-4 sm:px-6 py-3 mb-6">
              <Mail className="h-4 w-4 text-secondary-600" />
              <span className="text-xs sm:text-sm font-semibold text-secondary-700">Stay Updated</span>
            </div>

            <h2 className="animate-on-scroll text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 px-2 sm:px-0">
              Join Our <span className="bg-gradient-to-r from-secondary-600 to-primary-600 bg-clip-text text-transparent font-serif-display font-normal italic">Newsletter</span>
            </h2>

            <p className="animate-on-scroll text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              Stay informed with bi-weekly updates on the latest tools, use cases, and ideas from the ATEK IT team.
            </p>
          </div>

          <div className="animate-on-scroll max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-soft border border-gray-200">
              {submitStatus === 'success' ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Successfully Subscribed!</h4>
                  <p className="text-gray-600">Thank you for subscribing to our newsletter. You'll receive the latest insights and updates.</p>
                </div>
              ) : (
                <form className="space-y-4" netlify data-netlify="true" method="POST" name="newsletter">
                  <input type="hidden" name="form-name" value="newsletter" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-4 rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 font-semibold flex items-center justify-center space-x-2"
                  >
                    <span>Subscribe Now</span>
                    <Mail className="h-5 w-5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contribute Section */}
      <section className="py-16 sm:py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary-100/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-secondary-100/30 to-transparent rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="animate-on-scroll inline-flex items-center space-x-2 bg-accent-100/80 backdrop-blur-sm border border-accent-200/50 rounded-full px-4 sm:px-6 py-3 mb-6">
              <Users className="h-4 w-4 text-accent-600" />
              <span className="text-xs sm:text-sm font-semibold text-accent-700">Collaborate With Us</span>
            </div>

            <h2 className="animate-on-scroll text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 px-2 sm:px-0">
              Want to Contribute or <span className="bg-gradient-to-r from-accent-600 to-primary-600 bg-clip-text text-transparent font-serif-display font-normal italic">Collaborate</span>?
            </h2>

            <p className="animate-on-scroll text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              We welcome guest contributions, thought leadership pieces, and client stories. If you're an
              industry expert, a happy customer, or a tech writer—we'd love to hear from you.
            </p>
          </div>

          <div className="animate-on-scroll text-center">
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact our editorial team:</h3>
              <a
                href="mailto:info@atekit.com"
                className="inline-flex items-center space-x-2 bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-semibold"
              >
                <Mail className="h-5 w-5" />
                <span>info@atekit.com</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-900 to-primary-900 text-white relative overflow-hidden">
        <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            <span className="font-serif-display font-normal italic">ATEK IT</span> Inc.
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Frisco, TX | Serving Clients Globally
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="group bg-white text-primary-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-all duration-300 font-semibold text-base sm:text-lg shadow-medium hover:shadow-large transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-center space-x-2">
                <span>Back to Home</span>
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </a>

            <a
              href="/services"
              className="group border-2 border-white/30 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl hover:bg-white/10 transition-all duration-300 font-semibold text-base sm:text-lg backdrop-blur-sm"
            >
              <div className="flex items-center justify-center space-x-2">
                <span>Explore Services</span>
                <Settings className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </a>

            <a
              href="/contact#contact-section"
              className="group border-2 border-white/30 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl hover:bg-white/10 transition-all duration-300 font-semibold text-base sm:text-lg backdrop-blur-sm"
            >
              <div className="flex items-center justify-center space-x-2">
                <span>Request a Consultation</span>
                <Target className="h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InsightsContent;