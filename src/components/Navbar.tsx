"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, User, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "CEFR Levels", href: "/levels" },
    { name: "Take a Test", href: "/placement-test" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 group-hover:scale-110 transition-transform duration-300">
              <Image 
                src="/logo.png" 
                alt="FluentYapp Logo" 
                fill
                className="object-contain"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-2xl tracking-tight text-foreground">Fluent<span className="text-primary">Yapp</span></span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wider border border-primary/20">Beta</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {navLinks.map((link) => {
              if (link.name === "Take a Test") {
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="ml-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white font-extrabold text-sm transition-all duration-300 shadow-sm hover:shadow-primary/30"
                  >
                    {link.name}
                  </Link>
                );
              }
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-4 py-2 rounded-full text-sm font-bold text-foreground/70 hover:text-foreground hover:bg-secondary/80 transition-all duration-300"
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Auth Buttons & Theme (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-sm font-medium hover:text-primary transition-colors flex items-center space-x-1"
            >
              <User size={18} />
              <span>Login</span>
            </Link>
            <Link
              href="/signup"
              className="text-sm font-bold bg-gradient-to-r from-primary to-accent text-white px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground p-2 rounded-md hover:bg-secondary transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2 shadow-inner">
              {navLinks.map((link) => {
                if (link.name === "Take a Test") {
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block mt-4 mb-2 text-center border-2 border-primary text-primary hover:bg-primary hover:text-white px-4 py-3 rounded-xl font-extrabold text-lg transition-all duration-300 shadow-sm hover:shadow-primary/30"
                    >
                      {link.name}
                    </Link>
                  );
                }
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-xl text-base font-bold text-foreground/70 hover:text-foreground hover:bg-secondary/50 transition-all border border-transparent hover:border-border"
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="mt-6 pt-6 border-t border-border flex flex-col space-y-3">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center space-x-2 w-full px-4 py-3 rounded-xl border border-border text-foreground hover:bg-secondary transition-colors font-medium"
                >
                  <User size={18} />
                  <span>Login</span>
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-full px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg transition-all font-bold"
                >
                  Sign Up Free
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
