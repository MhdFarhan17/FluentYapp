import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-secondary/30 border-t border-border py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-4 group">
              <div className="relative w-8 h-8 group-hover:rotate-12 transition-transform">
                <Image 
                  src="/logo.png" 
                  alt="FluentYapp Logo" 
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-lg tracking-tight text-primary">FluentYapp</span>
            </Link>
            <p className="text-foreground/70 mb-6 max-w-sm">
              Master English faster with adaptive curriculums tailored specifically to your strengths and weaknesses.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Platform</h3>
            <ul className="space-y-3">
              <li><Link href="/levels" className="text-foreground/70 hover:text-primary transition-colors text-sm">CEFR Levels</Link></li>
              <li><Link href="/features" className="text-foreground/70 hover:text-primary transition-colors text-sm">Features</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-foreground">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-foreground/70 hover:text-primary transition-colors text-sm">About Us</Link></li>
              <li><Link href="/contact" className="text-foreground/70 hover:text-primary transition-colors text-sm">Contact</Link></li>
              <li><Link href="/privacy" className="text-foreground/70 hover:text-primary transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-foreground/70 hover:text-primary transition-colors text-sm">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 text-center text-foreground/50 text-sm">
          <p>&copy; {new Date().getFullYear()} FluentYapp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
