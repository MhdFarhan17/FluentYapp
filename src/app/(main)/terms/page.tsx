"use client";

import { Scale, FileText, UserX, Ban, Copyright, RefreshCw, AlertTriangle, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function TermsOfService() {
  const sections = [
    {
      icon: <FileText size={24} />,
      title: "1. Acceptance of Terms",
      content: "FluentYapp provides an adaptive language learning platform. By creating an account and using the platform, you agree to comply with all applicable local and international laws. These Terms constitute a legally binding agreement between you and FluentYapp.",
    },
    {
      icon: <UserX size={24} />,
      title: "2. Account Responsibilities",
      content: "You are responsible for maintaining the confidentiality of your account credentials. Any activity that occurs under your account is your responsibility. You agree to provide accurate, current, and complete information during registration. You must notify us immediately of any unauthorized use of your account.",
    },
    {
      icon: <Ban size={24} />,
      title: "3. Prohibited Conduct",
      content: "When using FluentYapp, you agree not to:",
      list: [
        "Attempt to reverse-engineer, decompile, or hack our curriculum algorithms or speech analysis systems.",
        "Share your account credentials with third parties.",
        "Use the platform for any illegal or unauthorized purpose.",
        "Upload or transmit any malicious code, viruses, or harmful data.",
        "Harass, abuse, or harm other users of the platform.",
        "Scrape, data-mine, or automatically extract content from the platform.",
      ]
    },
    {
      icon: <Copyright size={24} />,
      title: "4. Intellectual Property",
      content: "All content on the FluentYapp platform, including text, graphics, logos, curriculum structures, audio recordings, and software, is the property of FluentYapp and is protected by copyright laws. You may not reproduce, distribute, or create derivative works without our prior written permission.",
    },
    {
      icon: <AlertTriangle size={24} />,
      title: "5. Disclaimer of Warranties",
      content: "FluentYapp is provided on an \"as is\" and \"as available\" basis. We do not guarantee that the platform will be uninterrupted, error-free, or completely secure. While we strive for accuracy in our CEFR assessments and curriculum, results may vary based on individual learning habits and consistency.",
    },
    {
      icon: <UserX size={24} />,
      title: "6. Termination",
      content: "We reserve the right to suspend or terminate your account at our sole discretion, without prior notice, if you violate any of these Terms of Service. Upon termination, your right to access the platform will immediately cease. You may also delete your account at any time through your account settings.",
    },
    {
      icon: <RefreshCw size={24} />,
      title: "7. Changes to Terms",
      content: "We may update these terms periodically to reflect changes in our practices or for legal, regulatory, or operational reasons. Continued use of the platform after any such changes shall constitute your consent to such changes. We will notify registered users of significant changes via email.",
    },
  ];

  return (
    <div className="bg-background min-h-screen pt-28 pb-32 overflow-hidden selection:bg-primary/30 relative">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] -z-10 animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="w-20 h-20 bg-accent/10 text-accent rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Scale size={40} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
            Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Service</span>
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
            Welcome to FluentYapp. By accessing or using our platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
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
                <div className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center shadow-inner shrink-0">
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
                      <div className="w-2 h-2 bg-accent rounded-full mt-2.5 shrink-0" />
                      <p className="text-lg font-medium leading-relaxed">{item}</p>
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
          className="mt-12 bg-gradient-to-r from-accent/5 via-background to-primary/5 border border-border/60 rounded-[2rem] p-8 md:p-12 text-center shadow-lg"
        >
          <p className="text-foreground/60 font-medium text-lg mb-4">
            If you have any questions about these Terms, we're happy to help.
          </p>
          <div className="flex items-center justify-center space-x-2 text-foreground/50">
            <Mail size={18} />
            <span className="font-bold">Contact us at <a href="mailto:fluentyapp@mdfarhan.site" className="text-primary hover:underline">fluentyapp@mdfarhan.site</a></span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
