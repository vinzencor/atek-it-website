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
import ArticleModal, { type Article } from './ArticleModal';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

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

  // Comprehensive article data with full content
  const articlesData: Record<string, Article> = {
    "How PayPilot Cut Payroll Time by 90% for a 100+ Consultant Firm": {
      title: "How PayPilot Cut Payroll Time by 90% for a 100+ Consultant Firm",
      category: "PayPilot Use Cases",
      categoryColor: "primary",
      excerpt: "Discover how a mid-sized consulting firm transformed their payroll operations from a 40-hour monthly nightmare into a streamlined 4-hour process using PayPilot's intelligent automation.",
      content: `Managing payroll for over 100 consultants across multiple projects was consuming 40+ hours every month for this growing consulting firm. The finance team was drowning in spreadsheets, manual calculations, and constant back-and-forth with project managers to verify hours and rates.

The challenge wasn't just the time—it was the errors. With consultants working on multiple projects at different billing rates, manual tracking led to frequent mistakes that damaged client relationships and consultant satisfaction.

PayPilot transformed this process completely. By integrating directly with their existing time tracking system and QuickBooks, the platform automated rate calculations, project allocations, and invoice generation. The finance team now spends just 4 hours per month on payroll—a 90% reduction.

The key features that made this possible include automated time sheet validation, multi-project rate management, real-time approval workflows, and seamless integration with their existing accounting systems. The ROI was immediate: the firm recovered 36 hours of finance team time monthly, eliminated payroll errors entirely, and improved consultant satisfaction scores by 40%.

Beyond time savings, PayPilot provided unprecedented visibility into project profitability and resource allocation. The firm can now make data-driven decisions about project staffing and pricing with confidence.`,
      author: "Sarah Mitchell",
      date: "January 15, 2025",
      readTime: "5 min read",
      tags: ["PayPilot", "Case Study", "Payroll Automation", "Consulting Operations"],
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop"
    },
    "Integrating QuickBooks and Zoho with PayPilot: What You Need to Know": {
      title: "Integrating QuickBooks and Zoho with PayPilot: What You Need to Know",
      category: "PayPilot Use Cases",
      categoryColor: "primary",
      excerpt: "A comprehensive guide to seamlessly connecting PayPilot with your existing QuickBooks and Zoho systems for end-to-end financial automation.",
      content: `Integration is often the biggest concern when adopting new software. Organizations worry about data migration, system compatibility, and workflow disruption. With PayPilot's native integrations for QuickBooks and Zoho, these concerns are addressed from day one.

The QuickBooks integration enables bidirectional data sync, ensuring that payroll data, invoices, and expense reports flow seamlessly between systems. You can map PayPilot projects to QuickBooks classes, sync consultant profiles with vendor records, and automatically generate journal entries for payroll runs.

For Zoho users, PayPilot offers similar deep integration capabilities. Time entries from Zoho Projects sync automatically, CRM data informs billing rates and client relationships, and financial reports consolidate data from both platforms.

The setup process is straightforward: authenticate your accounts, map your data fields, configure sync preferences, and test with a small dataset before going live. Most organizations complete integration in under 2 hours.

Best practices include starting with read-only sync to verify data accuracy, using PayPilot's field mapping wizard for custom fields, scheduling syncs during off-peak hours, and maintaining regular backup protocols. Common pitfalls to avoid include skipping the test phase, not documenting custom field mappings, and overlooking user permission settings.

The result is a unified financial ecosystem where data flows automatically, reducing manual entry, eliminating errors, and providing real-time visibility across your entire operation.`,
      author: "Michael Chen",
      date: "January 10, 2025",
      readTime: "7 min read",
      tags: ["PayPilot", "Integration", "QuickBooks", "Zoho", "Automation"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop"
    },
    "Best Practices for Time Tracking in Consulting Operations": {
      title: "Best Practices for Time Tracking in Consulting Operations",
      category: "PayPilot Use Cases",
      categoryColor: "primary",
      excerpt: "Learn proven strategies for implementing effective time tracking that consultants actually use, improving billing accuracy and project profitability.",
      content: `Time tracking is the foundation of consulting profitability, yet it's often the most neglected aspect of operations. Consultants resist it, managers struggle to enforce it, and finance teams deal with incomplete or inaccurate data.

The key to successful time tracking is making it effortless. PayPilot's mobile-first approach allows consultants to log time in seconds, from anywhere. Integration with calendar systems pre-populates entries based on meetings, while AI-powered suggestions learn from patterns to recommend time allocations.

Establish clear policies from day one. Define what's billable versus non-billable, set expectations for daily entry (not weekly or monthly), require project and task-level detail, and implement approval workflows for accountability.

Technology enablement is crucial. Use mobile apps for on-the-go entry, enable calendar integration for automatic suggestions, implement reminder notifications for missing entries, and provide real-time dashboards for visibility.

Manager oversight ensures compliance. Review team time entries weekly, address gaps immediately, recognize consistent compliance, and use data to identify training needs.

The business impact is significant: improved billing accuracy increases revenue by 15-25%, better project visibility enables proactive management, accurate data supports pricing decisions, and consultant accountability improves utilization rates.

Remember, time tracking isn't about micromanagement—it's about visibility, accuracy, and making data-driven decisions that benefit both the business and consultants.`,
      author: "Jennifer Rodriguez",
      date: "January 5, 2025",
      readTime: "6 min read",
      tags: ["Time Tracking", "Consulting", "Best Practices", "PayPilot", "Productivity"],
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop"
    },
    "Choosing Between AWS, Azure, and GCP for Your Mid-Sized Business": {
      title: "Choosing Between AWS, Azure, and GCP for Your Mid-Sized Business",
      category: "Cloud & DevOps",
      categoryColor: "secondary",
      excerpt: "A practical comparison of the three major cloud platforms to help mid-sized businesses make the right choice for their specific needs and constraints.",
      content: `Choosing a cloud platform is one of the most important technology decisions your business will make. While AWS, Azure, and Google Cloud Platform (GCP) all offer robust capabilities, the right choice depends on your specific context.

AWS leads in market share and service breadth, offering over 200 services with the most mature ecosystem. It's ideal for businesses prioritizing flexibility, extensive third-party integrations, and access to cutting-edge services. The learning curve is steep, but the community support is unmatched.

Azure excels for organizations already invested in Microsoft technologies. If you're using Office 365, Active Directory, or .NET applications, Azure's native integration provides significant advantages. The hybrid cloud capabilities are industry-leading, making it perfect for gradual cloud migration.

GCP stands out for data analytics and machine learning. Built on Google's infrastructure, it offers superior performance for big data workloads and the most developer-friendly experience. Pricing is often more competitive, especially for compute-intensive workloads.

For mid-sized businesses, consider these factors: existing technology stack and skills, specific workload requirements, budget constraints and pricing models, compliance and regulatory needs, and growth trajectory and scalability needs.

A hybrid or multi-cloud approach might be optimal. Use Azure for Microsoft workloads, AWS for general-purpose applications, and GCP for data analytics. This requires more operational complexity but provides flexibility and risk mitigation.

The decision framework should include conducting a workload assessment, evaluating total cost of ownership, assessing team skills and training needs, running proof-of-concept projects, and planning for long-term scalability.

Remember, you're not locked in forever. Cloud migration is increasingly common, and tools exist to facilitate movement between platforms. Start with the best fit for today while maintaining architectural flexibility for tomorrow.`,
      author: "David Park",
      date: "December 28, 2024",
      readTime: "8 min read",
      tags: ["Cloud Computing", "AWS", "Azure", "GCP", "Cloud Strategy"],
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop"
    },
    "Implementing Infrastructure-as-Code with Terraform & Ansible": {
      title: "Implementing Infrastructure-as-Code with Terraform & Ansible",
      category: "Cloud & DevOps",
      categoryColor: "secondary",
      excerpt: "Master the art of infrastructure automation by combining Terraform's provisioning power with Ansible's configuration management capabilities.",
      content: `Infrastructure-as-Code (IaC) has transformed how organizations manage their technology infrastructure. By treating infrastructure as software, teams can version control, test, and automate their entire stack. Terraform and Ansible are complementary tools that together provide comprehensive infrastructure automation.

Terraform excels at provisioning infrastructure—creating cloud resources, networks, and services. Its declarative approach means you describe what you want, and Terraform figures out how to create it. The state management ensures consistency and enables safe updates to existing infrastructure.

Ansible handles configuration management—installing software, managing files, and configuring services. Its agentless architecture and simple YAML syntax make it accessible to teams without deep programming expertise. The idempotent nature ensures operations can be safely repeated.

The ideal workflow combines both tools: use Terraform to provision infrastructure (VMs, networks, databases), then use Ansible to configure those resources (install applications, manage users, deploy code). This separation of concerns creates maintainable, scalable automation.

Best practices include storing all code in version control, using modules for reusability, implementing proper secret management, testing changes in staging environments, and documenting your infrastructure decisions.

Common pitfalls to avoid include hardcoding credentials, not using remote state for Terraform, skipping testing phases, and creating overly complex modules. Start simple and iterate based on actual needs.

The business impact is substantial: infrastructure deployment time drops from days to minutes, configuration drift is eliminated, disaster recovery becomes automated, and teams can focus on innovation rather than manual operations.`,
      author: "Alex Thompson",
      date: "December 20, 2024",
      readTime: "7 min read",
      tags: ["Infrastructure-as-Code", "Terraform", "Ansible", "DevOps", "Automation"],
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop"
    },
    "Kubernetes vs. Docker Swarm: What Works Best in 2025?": {
      title: "Kubernetes vs. Docker Swarm: What Works Best in 2025?",
      category: "Cloud & DevOps",
      categoryColor: "secondary",
      excerpt: "An updated comparison of container orchestration platforms to help you choose the right solution for your organization's needs in 2025.",
      content: `Container orchestration has become essential for modern application deployment. While Kubernetes has dominated the conversation, Docker Swarm remains a viable alternative for many use cases. The right choice depends on your specific requirements and constraints.

Kubernetes offers unmatched flexibility and features. It's the industry standard, with extensive ecosystem support, advanced scheduling capabilities, and robust networking options. However, this power comes with complexity—the learning curve is steep, and operational overhead is significant.

Docker Swarm provides simplicity and ease of use. If you're already using Docker, Swarm is a natural extension with minimal additional learning. Setup takes minutes instead of hours, and the operational burden is much lighter. For smaller teams or simpler applications, this simplicity is valuable.

In 2025, Kubernetes has matured significantly. Managed services from cloud providers have reduced operational complexity, and tools like K3s and MicroK8s make it accessible for smaller deployments. The ecosystem is rich with solutions for monitoring, security, and service mesh.

Docker Swarm has found its niche in edge computing and resource-constrained environments. Its lightweight footprint and simple architecture make it ideal for IoT deployments, development environments, and organizations that need container orchestration without Kubernetes complexity.

Choose Kubernetes if you need advanced features, have complex microservices architectures, require extensive third-party integrations, or have dedicated DevOps resources. Choose Docker Swarm if you prioritize simplicity, have smaller-scale deployments, need quick setup and minimal overhead, or are already invested in Docker tooling.

Many organizations use both: Kubernetes for production workloads and Docker Swarm for development or edge deployments. This hybrid approach leverages the strengths of each platform.`,
      author: "Rachel Kim",
      date: "December 15, 2024",
      readTime: "6 min read",
      tags: ["Kubernetes", "Docker Swarm", "Container Orchestration", "DevOps", "Cloud Native"],
      image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=400&fit=crop"
    },
    "5 SaaS Design Decisions That Make or Break Scale": {
      title: "5 SaaS Design Decisions That Make or Break Scale",
      category: "SaaS & Software Development",
      categoryColor: "accent",
      excerpt: "Critical architectural decisions that determine whether your SaaS application can scale from 100 to 100,000 users without a complete rewrite.",
      content: `Building a SaaS application that scales requires making the right architectural decisions early. While you can refactor code, changing fundamental design decisions later is expensive and risky. Here are five critical choices that determine your scaling success.

Multi-tenancy architecture is decision number one. Will you use a single database for all customers, separate databases per customer, or a hybrid approach? Single-tenant offers simplicity and data isolation but limits density. Multi-tenant maximizes resource efficiency but requires careful design for data isolation and performance.

Database design and sharding strategy is equally critical. How will you partition data as you grow? Schema design, indexing strategy, and query patterns established early determine your ability to scale. Consider read replicas, caching layers, and eventual consistency patterns from the start.

Authentication and authorization architecture must scale with your user base. Will you build your own or use a service? How will you handle SSO, MFA, and role-based access control? These decisions impact security, user experience, and operational complexity.

Background job processing and queue architecture determines how you handle asynchronous work. Email sending, report generation, and data processing must scale independently of your web tier. Choose the right queue technology and design for idempotency and retry logic.

API design and versioning strategy affects your ability to evolve without breaking clients. RESTful vs GraphQL, versioning approach, rate limiting, and documentation all impact developer experience and operational stability.

The key is making informed decisions based on your specific context. A startup with 100 users has different needs than an enterprise with 100,000. Start simple, but design for evolution. Use managed services where possible, and focus your engineering effort on your unique value proposition.`,
      author: "Marcus Johnson",
      date: "December 10, 2024",
      readTime: "9 min read",
      tags: ["SaaS", "Software Architecture", "Scalability", "Multi-tenancy", "System Design"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop"
    },
    "How to Build a Multi-Tenant SaaS App from Day One": {
      title: "How to Build a Multi-Tenant SaaS App from Day One",
      category: "SaaS & Software Development",
      categoryColor: "accent",
      excerpt: "A comprehensive guide to implementing multi-tenancy architecture from the ground up, avoiding costly refactoring down the road.",
      content: `Multi-tenancy is the cornerstone of efficient SaaS architecture, but implementing it correctly from day one requires careful planning and execution. The decisions you make early will impact your application's scalability, security, and operational costs for years to come.

The first decision is choosing your multi-tenancy model. Shared database with shared schema is the most resource-efficient approach, where all tenants share the same database and tables, with a tenant_id column distinguishing data. This maximizes density but requires meticulous attention to data isolation and query performance.

Shared database with separate schemas offers a middle ground. Each tenant gets their own schema within a shared database, providing better isolation while still maintaining reasonable resource efficiency. This approach simplifies backup and restore operations per tenant and provides clearer data boundaries.

Separate databases per tenant provides maximum isolation and customization potential. Each tenant gets their own database instance, making it easier to meet compliance requirements and offer tenant-specific customizations. However, this approach increases operational complexity and infrastructure costs.

Implementation best practices include using row-level security policies to enforce tenant isolation, implementing tenant context middleware that sets the current tenant for all queries, creating comprehensive audit logging for compliance and debugging, and designing your schema with tenant_id as part of composite indexes for query performance.

Security considerations are paramount. Never trust client-supplied tenant identifiers, always validate tenant access at the API gateway level, implement rate limiting per tenant to prevent noisy neighbor problems, and encrypt sensitive data at rest and in transit with tenant-specific keys when required.

Performance optimization requires careful attention to database indexing strategies, implementing caching layers with tenant-aware cache keys, using connection pooling efficiently across tenants, and monitoring query performance per tenant to identify optimization opportunities.

The migration path matters too. Start with the simplest approach that meets your needs, and design your data access layer to abstract the multi-tenancy implementation. This allows you to evolve your approach as you scale without rewriting your entire application.`,
      author: "Elena Vasquez",
      date: "December 5, 2024",
      readTime: "8 min read",
      tags: ["Multi-tenancy", "SaaS Architecture", "Database Design", "Security", "Scalability"],
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop"
    },
    "Understanding SaaS Product-Market Fit for B2B Clients": {
      title: "Understanding SaaS Product-Market Fit for B2B Clients",
      category: "SaaS & Software Development",
      categoryColor: "accent",
      excerpt: "Learn how to identify, measure, and achieve product-market fit for B2B SaaS products in competitive enterprise markets.",
      content: `Product-market fit is the holy grail for SaaS companies, but achieving it in B2B markets requires a different approach than consumer products. The sales cycles are longer, the decision-makers are multiple, and the stakes are higher.

Understanding your ideal customer profile (ICP) is the foundation. In B2B SaaS, this goes beyond demographics to include company size, industry vertical, technology stack, budget authority, and pain points. Your ICP should be specific enough to guide product decisions but broad enough to support growth.

The signs of product-market fit in B2B are distinct. You'll see organic referrals from existing customers, shorter sales cycles as your value proposition becomes clearer, higher win rates in competitive deals, and customers expanding their usage beyond initial deployments. Most importantly, you'll hear customers say they can't imagine going back to their old way of working.

Measuring product-market fit requires both quantitative and qualitative metrics. Track net revenue retention (NRR) above 100%, customer acquisition cost (CAC) payback period under 12 months, and product qualified leads (PQLs) converting at increasing rates. Qualitatively, monitor customer interviews for strong emotional responses and unsolicited testimonials.

The path to product-market fit involves rapid iteration based on customer feedback. Implement a structured customer development process with regular check-ins, build a feedback loop from sales and customer success teams, and prioritize features that solve urgent, expensive problems for your ICP.

Common pitfalls include trying to serve too many customer segments simultaneously, building features for the loudest customer rather than the most representative, and declaring product-market fit prematurely based on vanity metrics. Stay focused on solving a specific problem exceptionally well for a defined customer segment.

Once you achieve product-market fit, the challenge becomes maintaining it as markets evolve. Continuously validate your assumptions, monitor competitive threats, and stay close to your customers' changing needs. Product-market fit isn't a destination—it's an ongoing journey of alignment between your product and market needs.`,
      author: "Thomas Anderson",
      date: "November 28, 2024",
      readTime: "7 min read",
      tags: ["Product-Market Fit", "B2B SaaS", "Customer Development", "Product Strategy", "Growth"],
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop"
    },
    "The Top 7 IT Consulting Challenges in 2025 and How to Solve Them": {
      title: "The Top 7 IT Consulting Challenges in 2025 and How to Solve Them",
      category: "IT Strategy & Consulting",
      categoryColor: "primary",
      excerpt: "Navigate the evolving landscape of IT consulting with proven strategies to overcome the most pressing challenges facing consultants and their clients today.",
      content: `The IT consulting landscape in 2025 presents unique challenges that require new approaches and strategies. Understanding these challenges and their solutions is critical for consultants who want to deliver exceptional value to their clients.

Challenge one is managing client expectations in an era of rapid technological change. Clients expect immediate results and cutting-edge solutions, but sustainable transformation takes time. The solution is setting clear milestones, educating clients on realistic timelines, and demonstrating incremental value throughout the engagement.

Challenge two involves balancing innovation with stability. Clients want the latest technologies but can't afford downtime or disruption. Address this by implementing phased rollouts, maintaining robust testing environments, and always having rollback plans. Use feature flags and canary deployments to minimize risk.

Challenge three is the talent shortage and skills gap. Finding consultants with the right mix of technical and business skills is increasingly difficult. Invest in continuous learning programs, build partnerships with training providers, and create clear career progression paths. Consider hybrid teams that combine junior talent with senior expertise.

Challenge four centers on cybersecurity and compliance. Every project now requires security-first thinking and compliance awareness. Embed security experts in project teams from day one, implement security by design principles, and maintain current knowledge of regulatory requirements across industries.

Challenge five is demonstrating ROI and business value. Technical success doesn't always translate to business success. Develop strong business acumen, establish clear success metrics before projects begin, and create dashboards that show business impact, not just technical metrics.

Challenge six involves remote and hybrid work dynamics. Building client relationships and team cohesion is harder when everyone is distributed. Invest in collaboration tools, establish clear communication protocols, and create opportunities for in-person connection when possible.

Challenge seven is staying relevant amid AI and automation. Many traditional consulting tasks are being automated. The solution is focusing on strategic advisory, change management, and complex problem-solving that requires human judgment. Embrace AI as a tool that enhances your capabilities rather than replaces them.`,
      author: "Patricia Williams",
      date: "January 20, 2025",
      readTime: "8 min read",
      tags: ["IT Consulting", "Challenges", "Strategy", "Client Management", "Professional Development"],
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=400&fit=crop"
    },
    "How to Choose a Technology Partner for Your Digital Transformation Project": {
      title: "How to Choose a Technology Partner for Your Digital Transformation Project",
      category: "IT Strategy & Consulting",
      categoryColor: "primary",
      excerpt: "A comprehensive framework for evaluating and selecting the right technology partner to ensure your digital transformation initiative succeeds.",
      content: `Choosing the right technology partner can make or break your digital transformation initiative. The wrong choice leads to missed deadlines, budget overruns, and failed projects. The right partner becomes a strategic asset that drives innovation and growth.

Start by defining your needs clearly. What specific outcomes are you trying to achieve? What capabilities do you need that you don't have in-house? What's your timeline and budget? Clear requirements enable better partner evaluation and set the foundation for a successful engagement.

Evaluate technical expertise and industry experience. Look for partners with proven experience in your industry and with the specific technologies you need. Ask for case studies, client references, and examples of similar projects. Technical certifications matter, but real-world experience matters more.

Assess cultural fit and communication style. You'll be working closely with this partner, so alignment on values, work style, and communication is critical. Do they listen well? Do they ask good questions? Do they challenge your assumptions constructively? These soft factors often determine project success.

Review their methodology and approach. How do they manage projects? What's their approach to requirements gathering, testing, and deployment? Do they use agile methodologies? How do they handle change requests and scope adjustments? A structured, transparent approach reduces risk.

Examine their team structure and stability. Who will actually work on your project? What's their experience level? How does the partner handle team continuity? High turnover or junior-heavy teams can derail projects. Insist on meeting the actual team members who will work on your project.

Consider their technology partnerships and ecosystem. Strong relationships with major technology vendors often indicate expertise and provide access to resources and support. Look for partners who are certified and recognized by the platforms you're using.

Evaluate their security and compliance practices. In today's environment, security can't be an afterthought. Review their security certifications, data handling practices, and compliance experience. Ask about their approach to secure development and their incident response procedures.

Finally, assess the commercial terms and contract structure. Look beyond the price to understand the total cost of ownership. Are there hidden fees? How do they handle scope changes? What are the payment terms and milestones? A fair, transparent contract protects both parties and sets clear expectations.`,
      author: "Robert Chen",
      date: "January 12, 2025",
      readTime: "9 min read",
      tags: ["Digital Transformation", "Partner Selection", "Vendor Management", "IT Strategy", "Due Diligence"],
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=400&fit=crop"
    },
    "Aligning IT Strategy with Business Goals: A C-Suite Playbook": {
      title: "Aligning IT Strategy with Business Goals: A C-Suite Playbook",
      category: "IT Strategy & Consulting",
      categoryColor: "primary",
      excerpt: "A practical guide for executives to ensure technology investments directly support business objectives and drive measurable outcomes.",
      content: `The gap between IT strategy and business goals remains one of the most persistent challenges in modern organizations. When technology and business operate in silos, companies miss opportunities, waste resources, and fall behind competitors. This playbook provides a framework for C-suite executives to bridge that gap.

Start with business outcomes, not technology. Too often, IT strategy begins with technology choices rather than business needs. Instead, clearly articulate your business goals: revenue growth targets, market expansion plans, operational efficiency improvements, or customer experience enhancements. Technology decisions should flow from these objectives.

Create a shared language between business and IT leaders. Business executives need to understand technology capabilities and constraints. IT leaders need to understand business models, competitive dynamics, and customer needs. Regular joint planning sessions, cross-functional teams, and shared KPIs build this common understanding.

Establish governance structures that ensure alignment. Create a technology steering committee with both business and IT representation. This committee should review major technology investments, prioritize initiatives based on business impact, and resolve conflicts between competing priorities.

Implement portfolio management for technology investments. Treat your technology portfolio like an investment portfolio, balancing quick wins with long-term strategic initiatives, innovation with maintenance, and risk with reward. Regularly review the portfolio to ensure it remains aligned with evolving business priorities.

Measure what matters to the business. Traditional IT metrics like uptime and ticket resolution time are important, but they don't tell the business story. Develop metrics that connect technology to business outcomes: revenue enabled by digital channels, cost savings from automation, customer satisfaction improvements from new capabilities.

Build technology roadmaps that map to business roadmaps. Your three-year technology plan should directly support your three-year business plan. Make the connections explicit: this infrastructure investment enables this market expansion, this application modernization supports this customer experience improvement.

Foster a culture of collaboration and innovation. Break down silos between IT and business units. Encourage business leaders to participate in technology decisions and IT leaders to participate in business planning. Create innovation programs that bring together diverse perspectives.

Plan for change and adaptability. Business conditions change, and your IT strategy must be flexible enough to adapt. Build modular, loosely coupled systems that can evolve. Maintain a balance between standardization and flexibility. Review and adjust your strategy quarterly, not just annually.`,
      author: "Catherine Martinez",
      date: "January 8, 2025",
      readTime: "8 min read",
      tags: ["IT Strategy", "Business Alignment", "C-Suite", "Governance", "Strategic Planning"],
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop"
    },
    "How to Build Real-Time Dashboards That Actually Get Used": {
      title: "How to Build Real-Time Dashboards That Actually Get Used",
      category: "Analytics, Automation & AI",
      categoryColor: "secondary",
      excerpt: "Design and implement real-time dashboards that drive action and decision-making, not just display data that nobody looks at.",
      content: `Most dashboards fail not because of technical limitations, but because they don't align with how people actually work and make decisions. Building dashboards that get used requires understanding user needs, designing for action, and implementing the right technical architecture.

Start with the decisions, not the data. Before building anything, identify the specific decisions your dashboard needs to support. What actions will users take based on this information? What questions are they trying to answer? A dashboard that doesn't drive decisions is just expensive wallpaper.

Know your audience and their context. Executives need high-level trends and anomalies. Managers need operational metrics and team performance. Individual contributors need detailed, actionable data. Design different views for different roles, and make it easy to drill down from summary to detail.

Follow the hierarchy of information design. The most important metrics should be immediately visible without scrolling. Use size, color, and position to create visual hierarchy. Avoid clutter—every element should serve a purpose. If users have to search for critical information, your design has failed.

Choose the right visualizations for your data. Line charts for trends over time, bar charts for comparisons, gauges for single metrics against targets, and heat maps for patterns across dimensions. Avoid pie charts for more than three categories and 3D charts entirely—they obscure data rather than illuminate it.

Implement real-time updates thoughtfully. Real-time doesn't mean updating every second—it means updating at the frequency that matters for decision-making. Stock traders need second-by-second updates; executives reviewing monthly trends don't. Match your update frequency to your use case to avoid overwhelming users and your infrastructure.

The technical architecture matters for performance and reliability. Use time-series databases for metrics data, implement efficient aggregation and rollup strategies, cache computed metrics appropriately, and design for graceful degradation when data sources are unavailable.

Make dashboards actionable, not just informational. Include links to drill-down reports, buttons to trigger workflows, and annotations to provide context. When a metric shows a problem, users should be able to investigate and act without leaving the dashboard.

Iterate based on usage data. Instrument your dashboards to track what users actually look at, how long they spend on different views, and what actions they take. Use this data to continuously improve the design and prioritize new features.`,
      author: "Daniel Kim",
      date: "January 18, 2025",
      readTime: "7 min read",
      tags: ["Dashboards", "Data Visualization", "Analytics", "Real-time Data", "UX Design"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop"
    },
    "Using AI to Automate Helpdesk and Infrastructure Monitoring": {
      title: "Using AI to Automate Helpdesk and Infrastructure Monitoring",
      category: "Analytics, Automation & AI",
      categoryColor: "secondary",
      excerpt: "Leverage artificial intelligence to transform IT operations, reduce response times, and free your team to focus on strategic initiatives.",
      content: `Artificial intelligence is transforming IT operations, enabling automation that was impossible just a few years ago. From intelligent ticket routing to predictive infrastructure monitoring, AI is helping IT teams do more with less while improving service quality.

AI-powered helpdesk automation starts with intelligent ticket classification and routing. Machine learning models can analyze ticket content, categorize issues, assign priority levels, and route to the appropriate team—all in seconds. This reduces response times and ensures tickets reach the right experts immediately.

Automated response generation handles common requests without human intervention. AI can answer frequently asked questions, provide password reset instructions, and guide users through standard troubleshooting steps. This frees helpdesk staff to focus on complex issues that require human expertise and judgment.

Sentiment analysis helps prioritize urgent issues. AI can detect frustration or urgency in ticket language and escalate accordingly. A ticket from an executive expressing frustration about a critical system gets immediate attention, even if the technical severity seems low.

For infrastructure monitoring, AI excels at anomaly detection. Traditional threshold-based alerts generate too many false positives. AI learns normal patterns for each metric and alerts only when behavior is genuinely anomalous. This dramatically reduces alert fatigue while catching real issues earlier.

Predictive maintenance uses AI to forecast failures before they occur. By analyzing historical patterns, current metrics, and external factors, AI can predict when a server is likely to fail, when storage will run out, or when network capacity will be exceeded. This enables proactive intervention instead of reactive firefighting.

Root cause analysis becomes faster and more accurate with AI. When an incident occurs, AI can correlate events across multiple systems, identify the likely root cause, and even suggest remediation steps based on similar past incidents. What used to take hours of investigation now takes minutes.

Implementation best practices include starting with high-volume, low-complexity use cases to build confidence, maintaining human oversight initially and gradually increasing automation, continuously training models with new data and feedback, and being transparent with users about when they're interacting with AI versus humans.

The ROI is compelling: reduced mean time to resolution, lower helpdesk staffing costs, improved employee satisfaction, and IT teams focused on innovation rather than routine tasks. However, success requires good data, clear processes, and a culture that embraces automation as an enabler, not a threat.`,
      author: "Sophia Patel",
      date: "January 14, 2025",
      readTime: "8 min read",
      tags: ["AI", "Automation", "IT Operations", "Helpdesk", "Infrastructure Monitoring", "Machine Learning"],
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop"
    },
    "Data Pipelines: ETL vs. ELT and When to Use Each": {
      title: "Data Pipelines: ETL vs. ELT and When to Use Each",
      category: "Analytics, Automation & AI",
      categoryColor: "secondary",
      excerpt: "Understand the fundamental differences between ETL and ELT approaches to data pipeline architecture and make the right choice for your use case.",
      content: `The choice between ETL (Extract, Transform, Load) and ELT (Extract, Load, Transform) is one of the most important architectural decisions in modern data engineering. While they sound similar, they represent fundamentally different approaches with distinct advantages and trade-offs.

ETL, the traditional approach, transforms data before loading it into the target system. Data is extracted from sources, transformed in a staging area or dedicated transformation engine, and then loaded into the data warehouse. This approach made sense when storage was expensive and compute power was limited.

ELT, the modern approach, loads raw data first and transforms it in the target system. Data is extracted from sources, loaded directly into the data warehouse or data lake, and transformed using the warehouse's compute power. This approach leverages the massive parallel processing capabilities of modern cloud data warehouses.

The advantages of ETL include reduced storage requirements in the target system, data quality validation before loading, and protection of sensitive data through transformation before storage. ETL works well when you have limited storage capacity, need to mask or encrypt data before storage, or have complex transformations that are easier to perform outside the warehouse.

The advantages of ELT include faster initial data loading, flexibility to transform data multiple ways, full historical data available for analysis, and leveraging the warehouse's powerful compute capabilities. ELT excels when you have abundant storage capacity, need to support multiple use cases from the same data, or want to preserve raw data for future analysis.

Performance considerations differ significantly. ETL can become a bottleneck when transformation logic is complex or data volumes are large. The transformation layer needs to scale independently. ELT pushes transformation work to the data warehouse, which is designed for massive parallel processing, but this can increase warehouse costs.

Cost implications vary by context. ETL requires investment in transformation infrastructure but reduces warehouse storage and compute costs. ELT minimizes transformation infrastructure but increases warehouse costs. Cloud data warehouses with usage-based pricing make ELT more economical for many use cases.

The hybrid approach combines both patterns. Use ELT for most data, preserving raw data and performing transformations in the warehouse. Use ETL for sensitive data that requires masking, data that needs significant cleansing before storage, or when integrating with legacy systems that expect pre-transformed data.

Choosing the right approach depends on your specific context: data volume and velocity, transformation complexity, storage and compute costs, data governance requirements, and team skills and tools. Many modern data platforms support both approaches, allowing you to choose the best pattern for each data source and use case.`,
      author: "James Morrison",
      date: "January 6, 2025",
      readTime: "7 min read",
      tags: ["Data Engineering", "ETL", "ELT", "Data Pipelines", "Data Warehousing", "Analytics"],
      image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=400&fit=crop"
    }
  };

  // Handler to open modal with selected article
  const handleArticleClick = (articleTitle: string) => {
    const article = articlesData[articleTitle];
    if (article) {
      setSelectedArticle(article);
      setIsModalOpen(true);
    }
  };

  // Handler to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

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
                        <div
                          key={articleIndex}
                          className="flex items-start space-x-3 group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-all duration-300"
                          onClick={() => handleArticleClick(article)}
                        >
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

      {/* Article Modal */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default InsightsContent;