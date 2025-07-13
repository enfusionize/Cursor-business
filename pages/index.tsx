import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  Leaf,
  TrendingUp,
  Shield,
  Target,
  Users,
  Globe,
  DollarSign,
  BarChart3,
  CheckCircle,
  Star
} from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: <Leaf className="h-8 w-8 text-green-400" />,
      title: "Conscious Investing",
      description: "Align your wealth with your values through ESG and impact investing opportunities."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-blue-400" />,
      title: "Superior Returns",
      description: "Track record of outperforming traditional investments while making positive impact."
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-400" />,
      title: "Risk Management",
      description: "Advanced portfolio optimization with AI-powered risk assessment and diversification."
    },
    {
      icon: <Target className="h-8 w-8 text-yellow-400" />,
      title: "Goal-Based Planning",
      description: "Personalized investment strategies tailored to your wealth preservation and growth goals."
    },
    {
      icon: <Users className="h-8 w-8 text-indigo-400" />,
      title: "Expert Guidance",
      description: "Access to certified financial advisors specializing in sustainable wealth management."
    },
    {
      icon: <Globe className="h-8 w-8 text-cyan-400" />,
      title: "Global Impact",
      description: "Track your positive environmental and social impact across all investments."
    },
    {
      icon: <DollarSign className="h-8 w-8 text-purple-400" />,
      title: "Exchange Access",
      description: "Access Enfusionize™ Exchange for AI-verified investment opportunities with real-time data tracking."
    }
  ];

  const stats = [
    { number: "$2.5B+", label: "Assets Under Management" },
    { number: "15.3%", label: "Average Annual Return" },
    { number: "500+", label: "Millionaire Clients" },
    { number: "98%", label: "Client Satisfaction" }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Tech Entrepreneur",
      image: "/api/placeholder/64/64",
      content: "Conscious Wealth helped me transition from tech exits to meaningful investments. My portfolio now generates both returns and positive impact."
    },
    {
      name: "Marcus Rodriguez",
      role: "Real Estate Investor",
      image: "/api/placeholder/64/64",
      content: "The platform's ESG focus aligns perfectly with my values. I've seen 18% returns while funding sustainable housing projects."
    },
    {
      name: "Dr. Emily Watson",
      role: "Medical Professional",
      image: "/api/placeholder/64/64",
      content: "Finally, an investment platform that understands the responsibility that comes with wealth. Outstanding results and impact tracking."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-green-400 mr-3" />
              <h1 className="text-xl font-bold text-white">Conscious Wealth</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/dashboard" className="text-white/70 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/roadmap" className="text-white/70 hover:text-white transition-colors">
                Roadmap
              </Link>
              <Link href="/exchange" className="text-white/70 hover:text-white transition-colors">
                Exchange
              </Link>
              <Link href="/wealthprint" className="text-white/70 hover:text-white transition-colors">
                Wealthprint™
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Wealth Management for the
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                {' '}Conscious Millionaire
              </span>
            </h1>
            <p className="text-xl text-white/70 mb-8 max-w-3xl mx-auto">
              Transform your newly created fortune into lasting wealth with purposeful investing. 
              Achieve superior returns while making a positive impact on the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors flex items-center justify-center"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/exchange"
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors border border-white/20"
              >
                Explore Exchange
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-white/70">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Conscious Wealth?
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Built specifically for new millionaires who want to grow their wealth responsibly
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-white/30 transition-all"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trusted by Successful Investors
            </h2>
            <p className="text-xl text-white/70">
              See what our clients say about their experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-white/70 mb-4">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-white/60 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl p-8 md:p-12 border border-white/20"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Wealth?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Join hundreds of millionaires who are building conscious wealth with purpose and impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors flex items-center justify-center"
              >
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/api/user/profile"
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors border border-white/20"
              >
                Schedule Consultation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/5 backdrop-blur-md border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Leaf className="h-6 w-6 text-green-400 mr-2" />
              <span className="text-white font-semibold">Conscious Wealth</span>
            </div>
            <div className="text-white/60 text-sm">
              © 2024 Conscious Wealth. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;