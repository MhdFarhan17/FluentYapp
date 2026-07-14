import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full relative bg-background">
      {/* Back to Home Button (Global) */}
      <Link href="/" className="absolute top-6 left-6 md:top-8 md:left-8 z-50 flex items-center space-x-2 text-foreground/70 hover:text-primary transition-colors font-semibold group">
        <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center group-hover:-translate-x-1 transition-transform shadow-sm">
          <ArrowLeft size={20} />
        </div>
        <span className="hidden md:block">Back to Home</span>
      </Link>
      {children}
    </div>
  );
}
