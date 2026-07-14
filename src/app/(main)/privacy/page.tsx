"use client";

import { ShieldCheck, Lock, Eye, Database, UserCheck, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: <Database size={24} />,
      title: "1. Information We Collect",
      content: "We may collect the following types of information when you use our services:",
      list: [
        { bold: "Account Data:", text: "Your name, email address, and password when you register." },
        { bold: "Voice Data:", text: "Audio processed via the Web Speech API solely for evaluating your pronunciation. We do not store your raw audio data permanently unless explicitly consented." },
        { bold: "Usage Data:", text: "Information about your interactions with the platform, such as test scores, module completion, and login frequency." },
        { bold: "Device Data:", text: "Browser type, operating system, and device information for optimizing your experience." },
      ]
    },
    {
      icon: <Eye size={24} />,
      title: "2. How We Use Your Data",
      content: "The data we collect is used to:",
      list: [
        { bold: "", text: "Generate your personalized adaptive curriculum based on your CEFR level." },
        { bold: "", text: "Analyze and track your English proficiency progress over time." },
        { bold: "", text: "Improve the accuracy of our speech analysis systems." },
        { bold: "", text: "Communicate with you regarding account updates or technical support." },
        { bold: "", text: "Ensure platform security and prevent fraudulent activities." },
      ]
    },
    {
      icon: <Lock size={24} />,
      title: "3. Data Security",
      content: "We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. Our database is hosted securely using modern cloud infrastructure, and all passwords are cryptographically hashed using bcrypt. All data transmissions are encrypted via SSL/TLS.",
    },
    {
      icon: <UserCheck size={24} />,
      title: "4. Your Rights",
      content: "You have the right to access, update, or delete your personal data at any time. You can do this directly from your account settings or by contacting us at fluentyapp@mdfarhan.site. Under applicable data protection laws (such as GDPR), you also have the right to data portability and the right to restrict or object to certain data processing activities.",
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "5. Cookies & Third-Party Services",
      content: "FluentYapp may use cookies and similar tracking technologies to enhance your user experience. We may also integrate third-party services (such as Supabase for authentication) that have their own privacy policies. We encourage you to review the privacy practices of any third-party services.",
    },
  ];

  return (
    <div className="bg-background min-h-screen pt-28 pb-32 overflow-hidden selection:bg-primary/30 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Policy</span>
          </h1>
          <p className="text-lg text-foreground/60 font-medium">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </motion.div>

        {/* Intro */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-background/60 backdrop-blur-xl border border-border/60 rounded-[2rem] p-8 md:p-12 shadow-lg mb-8"
        >
          <p className="text-lg text-foreground/80 leading-relaxed font-medium">
            At FluentYapp, we take your privacy seriously. This Privacy Policy describes how we collect, use, and protect your personal data when you use our website and application. Your trust is our top priority.
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-background/60 backdrop-blur-xl border border-border/60 rounded-[2rem] p-8 md:p-12 shadow-lg hover:shadow-xl transition-shadow duration-500"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shadow-inner shrink-0">
                  {section.icon}
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">{section.title}</h2>
              </div>
              <p className="text-lg text-foreground/70 leading-relaxed font-medium">
                {section.content}
              </p>
              {section.list && (
                <ul className="mt-6 space-y-3">
                  {section.list.map((item, i) => (
                    <li key={i} className="flex items-start space-x-3 text-foreground/70">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2.5 shrink-0" />
                      <p className="text-lg font-medium leading-relaxed">
                        {item.bold && <strong className="text-foreground">{item.bold}</strong>} {item.text}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 bg-gradient-to-r from-primary/5 via-background to-accent/5 border border-border/60 rounded-[2rem] p-8 md:p-12 text-center shadow-lg"
        >
          <p className="text-foreground/60 font-medium text-lg mb-4">
            By continuing to use FluentYapp, you acknowledge that you have read and understood this Privacy Policy.
          </p>
          <div className="flex items-center justify-center space-x-2 text-foreground/50">
            <Mail size={18} />
            <span className="font-bold">Questions? Contact us at <a href="mailto:fluentyapp@mdfarhan.site" className="text-primary hover:underline">fluentyapp@mdfarhan.site</a></span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
