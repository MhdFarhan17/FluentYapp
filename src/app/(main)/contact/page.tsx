"use client";

import { Mail, MapPin, Phone, Send, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function Contact() {
  return (
    <div className="bg-background min-h-screen pt-28 pb-32 overflow-hidden selection:bg-primary/30 relative">
      
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center space-x-2 bg-secondary/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-border mb-8 shadow-sm">
             <MessageSquare size={18} className="text-primary" />
             <span className="text-sm font-extrabold tracking-widest text-foreground/80 uppercase">Get in Touch</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight">
            Let's Start a <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Conversation.</span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground/70 font-medium leading-relaxed max-w-3xl mx-auto">
            Have questions about FluentYapp, or want to explore enterprise partnerships? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-background/60 backdrop-blur-xl p-10 md:p-14 rounded-[3rem] border border-border/80 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-[100px] -z-10" />
            
            <h2 className="text-3xl font-extrabold mb-8 tracking-tight">Send us a message</h2>
            <form action="https://api.web3forms.com/submit" method="POST" className="space-y-6">
              <input type="hidden" name="access_key" value="14b64e43-91de-4d01-a889-316733c5d236" />
              <input type="hidden" name="subject" value="New Contact Message from FluentYapp" />
              <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-foreground/80">First Name</label>
                  <input type="text" name="First Name" required className="w-full px-5 py-4 rounded-2xl border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all shadow-sm" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-foreground/80">Last Name</label>
                  <input type="text" name="Last Name" required className="w-full px-5 py-4 rounded-2xl border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all shadow-sm" placeholder="Doe" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-foreground/80">Email Address</label>
                <input type="email" name="email" required className="w-full px-5 py-4 rounded-2xl border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all shadow-sm" placeholder="you@company.com" />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-foreground/80">How can we help?</label>
                <textarea name="message" required rows={5} className="w-full px-5 py-4 rounded-2xl border border-border bg-background focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none shadow-sm" placeholder="Tell us more about your inquiry..." />
              </div>

              <button type="submit" className="w-full bg-primary text-white font-extrabold text-lg py-5 rounded-2xl hover:bg-primary-hover hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center space-x-3 group">
                <span>Send Message</span>
                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col justify-center space-y-12"
          >
            {[
              {
                icon: <Mail size={28} />,
                color: "text-blue-500",
                bg: "bg-blue-500/10",
                title: "Email Us",
                desc: "Our friendly team is here to help.",
                content: <a href="mailto:fluentyapp@mdfarhan.site" className="text-blue-500 font-bold text-lg hover:underline">fluentyapp@mdfarhan.site</a>
              },
              {
                icon: <MapPin size={28} />,
                color: "text-red-500",
                bg: "bg-red-500/10",
                title: "Office HQ",
                desc: "Come say hello at our headquarters.",
                content: <p className="font-bold text-lg leading-relaxed">Tangerang Regency<br/>Indonesia</p>
              },
              {
                icon: <Phone size={28} />,
                color: "text-green-500",
                bg: "bg-green-500/10",
                title: "WhatsApp",
                desc: "Mon-Fri from 8am to 5pm (GMT+7).",
                content: <a href="https://wa.me/6281211900924" target="_blank" rel="noreferrer" className="font-bold text-lg hover:text-green-500 transition-colors">+62 812-1190-0924</a>
              }
            ].map((info, idx) => (
              <div key={idx} className="flex items-start space-x-6 group">
                <div className={`w-16 h-16 ${info.bg} ${info.color} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-inner`}>
                  {info.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold mb-2 tracking-tight">{info.title}</h3>
                  <p className="text-foreground/60 mb-3 font-medium text-lg">{info.desc}</p>
                  {info.content}
                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
