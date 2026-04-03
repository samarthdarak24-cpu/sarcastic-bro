"use client";

import Link from "next/link";
import { Globe, Send, Briefcase, Mail } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-neut-900 text-white py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
              O
            </div>
            <span className="font-heading font-bold text-xl tracking-tight">
              ODOP <span className="text-brand-primary">Connect</span>
            </span>
          </div>
          <p className="text-neut-400 text-sm leading-relaxed">
            Revolutionizing the agricultural marketplace with direct farmer-to-buyer connectivity, AI quality assurance, and blockchain transparency.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="p-2 bg-neut-800 rounded-lg hover:bg-brand-primary transition-colors">
              <Send size={20} />
            </Link>
            <Link href="#" className="p-2 bg-neut-800 rounded-lg hover:bg-brand-primary transition-colors">
              <Briefcase size={20} />
            </Link>
            <Link href="#" className="p-2 bg-neut-800 rounded-lg hover:bg-brand-primary transition-colors">
              <Globe size={20} />
            </Link>
            <Link href="#" className="p-2 bg-neut-800 rounded-lg hover:bg-brand-primary transition-colors">
              <Mail size={20} />
            </Link>
          </div>
        </div>

        <div>
          <h4 className="font-heading font-bold text-lg mb-6">Product</h4>
          <ul className="space-y-4 text-neut-400 text-sm">
            <li><Link href="/farmer/dashboard" className="hover:text-white transition-colors">Farmer Hub</Link></li>
            <li><Link href="/buyer/dashboard" className="hover:text-white transition-colors">Buyer Sourcing</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Quality Assurance</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Supply Tracking</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-bold text-lg mb-6">Company</h4>
          <ul className="space-y-4 text-neut-400 text-sm">
            <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Sustainability</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-bold text-lg mb-6">Community</h4>
          <ul className="space-y-4 text-neut-400 text-sm">
            <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Community Forum</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Open Data</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Developer API</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-neut-800 flex flex-col md:flex-row justify-between items-center gap-4 text-neut-500 text-xs">
        <p>© 2024 ODOP Connect. Built with Next.js 14.</p>
        <div className="flex gap-8">
          <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
          <Link href="#" className="hover:text-white transition-colors">Security</Link>
        </div>
      </div>
    </footer>
  );
}
