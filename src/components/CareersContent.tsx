import React, { useEffect, useRef, useState } from 'react';
import {
  Zap, Users, TrendingUp, DollarSign, Globe, Shield,
  Code, MapPin, Phone, Mail, ArrowRight, Star, CheckCircle,
  X, ChevronDown, ChevronUp, Heart, Award
} from 'lucide-react';
import { initSmoothAnimations, cleanupAnimations } from '../utils/smoothAnimations';
import type { CareerJob } from '../utils/careers';
import { fetchJobCategories, organizeJobsByCategories, getCategoryColor } from '../utils/jobCategories';
import type { JobCategory, JobCategoryWithJobs } from '../utils/jobCategories';

// Job Card Component
interface JobCardProps {
  role: CareerJob;
  isExpanded: boolean;
  onToggleExpansion: (jobTitle: string) => void;
  onApplyClick: (jobTitle: string) => void;
  animationDelay: string;
  renderFullDescription: (description: string) => React.ReactNode;
  getTruncatedDescription: (description: string) => string;
}

const JobCard: React.FC<JobCardProps> = ({
  role,
  isExpanded,
  onToggleExpansion,
  onApplyClick,
  animationDelay,
  renderFullDescription,
  getTruncatedDescription
}) => {
  return (
    <div
      className="animate-on-scroll bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100"
      style={{ animationDelay }}
    >
      <div className="flex flex-col gap-4">
        {/* Job Header - Always Visible */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900 mb-2">{role.title}</h4>
              <button
                onClick={() => onToggleExpansion(role.title)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200 ml-2"
                aria-label={isExpanded ? "Collapse job details" : "Expand job details"}
              >
                {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
            </div>
            {!isExpanded && (
              <p className="text-gray-600 text-sm line-clamp-2">{getTruncatedDescription(role.description)}</p>
            )}
            <div className="mt-2 flex flex-wrap gap-1">
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">{role.experience}</span>
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{role.location}</span>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t border-gray-200 pt-4 space-y-4">
            {/* Full Description */}
            <div>
              {renderFullDescription(role.description)}
            </div>

            {/* Apply Button in Expanded View */}
            <div className="pt-2">
              <button
                onClick={() => onApplyClick(role.title)}
                className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium text-sm"
              >
                Apply for this Position
              </button>
            </div>
          </div>
        )}

        {/* Apply Button - Only show when collapsed */}
        {!isExpanded && (
          <div className="flex justify-end">
            <button
              onClick={() => onApplyClick(role.title)}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium text-sm whitespace-nowrap"
            >
              Apply Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const CareersContent = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedJob, setSelectedJob] = React.useState('');
  const [expandedJob, setExpandedJob] = React.useState<string | null>(null);

  const [cmsJobs, setCmsJobs] = useState<CareerJob[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [jobCategories, setJobCategories] = useState<JobCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [organizedJobs, setOrganizedJobs] = useState<JobCategoryWithJobs[]>([]);

  useEffect(() => {
    const observer = initSmoothAnimations(sectionRef.current);
    return () => cleanupAnimations(observer);
  }, []);

  // Fetch CMS jobs and job categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch jobs and categories in parallel
        const [jobsResponse, categoriesData] = await Promise.all([
          fetch('/api/careers'),
          fetchJobCategories()
        ]);

        if (jobsResponse.ok) {
          const jobs = await jobsResponse.json();
          setCmsJobs(jobs);
        } else {
          console.warn('Failed to fetch CMS jobs');
        }

        setJobCategories(categoriesData);
        setIsLoadingCategories(false);
      } catch (error) {
        console.warn('Error fetching data:', error);
        setIsLoadingCategories(false);
      } finally {
        setIsLoadingJobs(false);
      }
    };

    fetchData();
  }, []);

  // Organize jobs by categories when both jobs and categories are loaded
  useEffect(() => {
    if (!isLoadingJobs && !isLoadingCategories && jobCategories.length > 0) {
      const organized = organizeJobsByCategories(jobCategories, cmsJobs);
      setOrganizedJobs(organized);
    }
  }, [cmsJobs, jobCategories, isLoadingJobs, isLoadingCategories]);





  // Handle modal open
  const openModal = (jobTitle: string) => {
    setSelectedJob(jobTitle);
    setIsModalOpen(true);
  };

  // Handle modal close
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJob('');
  };

  // Handle job expansion (accordion-style: only one card can be expanded at a time)
  const toggleJobExpansion = (jobTitle: string) => {
    if (expandedJob === jobTitle) {
      // If clicking the currently expanded job, collapse it
      setExpandedJob(null);
    } else {
      // If clicking a different job, expand it (and collapse the previous one)
      setExpandedJob(jobTitle);
    }
  };

  // Check if job is expanded
  const isJobExpanded = (jobTitle: string) => expandedJob === jobTitle;

  // Parse markdown content for rich text display
  const parseMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br/>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br/>');
  };

  // Render full description with markdown support
  const renderFullDescription = (description: string) => {
    if (!description) return null;

    return (
      <div
        className="text-gray-600 text-sm leading-relaxed"
        dangerouslySetInnerHTML={{
          __html: parseMarkdown(description)
        }}
      />
    );
  };

  // Get truncated text for collapsed view (first 2 lines)
  const getTruncatedDescription = (description: string) => {
    if (!description) return '';

    // Remove markdown formatting for truncation
    const cleanText = description.replace(/[#*_`]/g, '').trim();

    // Split by lines and take first 2, or truncate by character count
    const lines = cleanText.split('\n').filter(line => line.trim());
    if (lines.length >= 2) {
      return lines.slice(0, 2).join(' ');
    }

    // If less than 2 lines, truncate by character count (~120 chars for 2 lines)
    return cleanText.length > 120 ? cleanText.substring(0, 120) + '...' : cleanText;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Add form-name for Netlify
    formData.append('form-name', 'job-application');

    // Submit to Netlify (for file uploads, we need to use FormData directly)
    fetch('/', {
      method: 'POST',
      body: formData
    })
    .then(() => {
      alert('Application submitted successfully! We will review your application and get back to you soon.');
      closeModal();
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('There was an error submitting your application. Please try again.');
    });
  };



  const whyJoinReasons = [
    {
      icon: <Globe className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Real Projects with Global Impact",
      description: "Work on high-performance applications, enterprise transformations, and cutting-edge SaaS products like ConsultPro.",
      color: "primary"
    },
    {
      icon: <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Strong Learning & Career Trajectory",
      description: "Our proprietary platform Pay Pilot is built to solve real consulting operations pain points—time tracking, payroll, billing, and reporting—under one intelligent roof.",
      color: "secondary"
    },
    {
      icon: <Users className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Inclusive & Dynamic Culture",
      description: "We embrace diversity, celebrate ideas, and promote a workplace where collaboration thrives.",
      color: "accent"
    },
    {
      icon: <DollarSign className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Competitive Compensation & Growth Paths",
      description: "We offer fair pay, project bonuses, internal mobility, and long-term career planning.",
      color: "primary"
    }
  ];

  // All available job roles for dropdown (from CMS)
  const allJobRoles = cmsJobs.map(job => job.title);

  return (
    <div ref={sectionRef}>
      {/* Hidden form for Netlify detection - DO NOT REMOVE */}
      <form
        name="job-application"
        data-netlify="true"
        data-netlify-uploads="true"
        method="POST"
        hidden
      >
        <input type="hidden" name="form-name" value="job-application" />
        <input type="text" name="name" />
        <select name="jobRole">
          <option value="">Select a position</option>
        </select>
        <input type="email" name="email" />
        <input type="file" name="resume" accept=".pdf,.doc,.docx" />
      </form>
      {/* Why Join ATEK IT */}
      <section className="py-12 sm:py-2 lg:pt-32 bg-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary-100/40 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-secondary-100/40 to-transparent rounded-full blur-3xl"></div>

        <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16 sm:mb-20">
            <div className="animate-on-scroll inline-flex items-center space-x-2 bg-primary-100/80 backdrop-blur-sm border border-primary-200/50 rounded-full px-4 sm:px-6 py-3 mb-6">
              <Star className="h-4 w-4 text-primary-600" />
              <span className="text-xs sm:text-sm font-semibold text-primary-700">Career Benefits</span>
            </div>
            
            <h2 className="animate-on-scroll text-3xl sm:text-4xl md:text-6xl font-bold text-neutral-900 mb-6 sm:mb-8 leading-tight px-2 sm:px-0">
              Why Join <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent font-serif-display font-normal italic">ATEK IT</span>?
            </h2>
          </div>

          {/* Why Join Reasons Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {whyJoinReasons.map((reason, index) => (
              <div 
                key={index} 
                className="animate-on-scroll group relative bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-soft hover:shadow-large transition-all duration-500 hover:-translate-y-2 border border-neutral-200/50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient Border Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${reason.color}-500/20 to-${reason.color}-600/20 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}></div>
                
                <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-${reason.color}-500 to-${reason.color}-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-medium group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    {reason.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 group-hover:text-primary-700 transition-colors duration-300 mb-3 sm:mb-4">
                      {reason.title}
                    </h3>
                    
                    <p className="text-neutral-600 leading-relaxed text-base sm:text-lg">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Currently Hiring */}
      <section id="openings" className="py-8 sm:py-12 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary-100/50 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary-100/50 to-transparent rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="animate-on-scroll inline-flex items-center space-x-2 bg-secondary-100/80 backdrop-blur-sm border border-secondary-200/50 rounded-full px-4 sm:px-6 py-3 mb-6">
              <Code className="h-4 w-4 text-secondary-600" />
              <span className="text-xs sm:text-sm font-semibold text-secondary-700">Open Positions</span>
            </div>
            
            <h2 className="animate-on-scroll text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 px-2 sm:px-0">
              Currently <span className="bg-gradient-to-r from-secondary-600 to-primary-600 bg-clip-text text-transparent font-serif-display font-normal italic">Hiring</span>
            </h2>
            <p className="animate-on-scroll text-lg text-gray-600 mb-8">
              Below are some of our most in-demand openings. If you don't see your role listed, we still 
              encourage you to apply under "Others" with a relevant job title.
            </p>
          </div>

          {/* Dynamic Job Categories */}
          {isLoadingJobs || isLoadingCategories ? (
            // Loading state
            <div className="space-y-12">
              {Array.from({ length: 3 }).map((_, categoryIndex) => (
                <div key={categoryIndex} className="mb-12">
                  <div className="animate-pulse flex items-center mb-6">
                    <div className="h-6 w-6 bg-gray-300 rounded mr-3"></div>
                    <div className="h-6 w-48 bg-gray-300 rounded"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="animate-pulse bg-gray-200 rounded-xl p-6 h-32"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            organizedJobs.map((category, categoryIndex) => {
              if (category.jobListings.length === 0) return null;

              return (
                <div key={category.id} className="mb-12">
                  <h3 className="animate-on-scroll text-xl font-bold text-gray-900 mb-6">
                    {category.name}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                    {category.jobListings.map((role, index) => (
                      <JobCard
                        key={role.title}
                        role={role}
                        isExpanded={isJobExpanded(role.title)}
                        onToggleExpansion={toggleJobExpansion}
                        onApplyClick={openModal}
                        animationDelay={`${index * 0.05}s`}
                        renderFullDescription={renderFullDescription}
                        getTruncatedDescription={getTruncatedDescription}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          )}

        </div>
      </section>



      {/* How to Apply */}
      <section className="py-16 sm:py-20 bg-white relative overflow-hidden">
        <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-br from-primary-200/30 to-secondary-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-bl from-secondary-200/30 to-accent-200/30 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="animate-on-scroll inline-flex items-center space-x-2 bg-primary-100/80 backdrop-blur-sm border border-primary-200/50 rounded-full px-4 sm:px-6 py-3 mb-6">
              <ArrowRight className="h-4 w-4 text-primary-600" />
              <span className="text-xs sm:text-sm font-semibold text-primary-700">Application Process</span>
            </div>
            
            <h2 className="animate-on-scroll text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 px-2 sm:px-0">
              How to <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent font-serif-display font-normal italic">Apply</span>
            </h2>
          </div>

          <div className="animate-on-scroll bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-soft border border-gray-200 mb-12">
            <div className="text-center space-y-4">
              <p className="text-lg text-gray-700">
                Use our <strong>Online Application Form</strong> or email your resume to{' '}
                <a href="mailto: info@atekit.com" className="text-primary-600 hover:text-primary-800 underline font-semibold">
                  info@atekit.com
                </a>
              </p>
              <p className="text-gray-600">
                Please include the relevant job title in your application.
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="animate-on-scroll bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-700 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-6"><span className="font-serif-display font-normal italic">ATEK IT</span> Inc.</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center justify-center space-x-3">
                <MapPin className="h-5 w-5 flex-shrink-0" />
                <a href="https://maps.app.goo.gl/9ja3HF3kQjsYn2LP7" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-gray-200 transition-colors duration-200">
                  7460 Warren Pkwy, Suite 100-148, Frisco, TX 75034
                </a>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <a href="tel:+14692692345" className="text-sm hover:text-gray-200 transition-colors duration-200">
                  +1 (469)-269-2345
                </a>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <a href="mailto: info@atekit.com" className="text-sm hover:text-gray-200 transition-colors duration-200">
                  info@atekit.com
                </a>
              </div>
            </div>
            

          </div>
        </div>
      </section>

      {/* Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Apply for Position</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">

                <form method="POST" name="job-application" onSubmit={handleSubmit} className="space-y-4">
                  <input type="hidden" name="form-name" value="job-application" />
                  {/* Applicant Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Applicant Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Job Role */}
                  <div>
                    <label htmlFor="jobRole" className="block text-sm font-medium text-gray-700 mb-1">
                      Job Role *
                    </label>
                    <select
                      id="jobRole"
                      name="jobRole"
                      value={selectedJob}
                      onChange={(e) => setSelectedJob(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                    >
                      <option value="">Select a position</option>
                      {organizedJobs.map((category) => (
                        category.jobListings.length > 0 && (
                          <optgroup key={category.id} label={category.name}>
                            {category.jobListings.map((role) => (
                              <option key={role.title} value={role.title}>
                                {role.title}
                              </option>
                            ))}
                          </optgroup>
                        )
                      ))}

                      <optgroup label="Other">
                        <option value="Other">Other Position</option>
                      </optgroup>
                    </select>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      placeholder="Enter your email address"
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  {/* Resume Upload */}
                  <div>
                    <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
                      Resume Upload *
                    </label>
                    <input
                      type="file"
                      id="resume"
                      name="resume"
                      required
                      accept=".pdf,.doc,.docx"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Accepted formats: PDF, DOC, DOCX (Max 5MB)
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-semibold"
                    >
                      Submit Application
                    </button>
                  </div>


                </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareersContent;