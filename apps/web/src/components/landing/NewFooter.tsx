"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
export function NewFooter() {
    const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    alert(`Subscribed: ${email}`);
    setEmail("");
  };

  const footerLinks = {
    platform: [
      { label: t("common.for_farmers"), href: "/farmer" },
      { label: t("common.for_buyers"), href: "/buyer" },
      { label: t("common.pricing"), href: "/pricing" },
      { label: t("common.features"), href: "#features" },
    ],
    company: [
      { label: t("common.about_us"), href: "/about" },
      { label: t("common.careers"), href: "/careers" },
      { label: t("common.blog"), href: "/blog" },
      { label: t("common.press_kit"), href: "/press" },
    ],
    support: [
      { label: t("common.help_center"), href: "/help" },
      { label: t("common.contact_us"), href: "/contact" },
      { label: t("common.api_docs"), href: "/docs" },
      { label: t("common.status"), href: "/status" },
    ],
    legal: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: t("common.cookies"), href: "/cookies" },
      { label: t("common.licenses"), href: "/licenses" },
    ],
  };

  return (
    <footer id="contact" className="bg-gradient-to-br from-[#111827] to-[#1f2937] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Section - Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 pb-12 border-b border-white/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-black mb-2">{t("landing.footer.stay_updated")}</h3>
              <p className="text-white/70">
                {t("landing.footer.newsletter_desc")}
              </p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("landing.footer.placeholder")}
                required
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#22c55e]"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-3 bg-[#22c55e] rounded-xl font-bold hover:bg-[#16a34a] transition-colors"
              >
                {t("landing.footer.subscribe")}
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Platform */}
          <div>
            <h4 className="font-bold text-lg mb-4">{t("landing.footer.platform")}</h4>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-[#22c55e] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-lg mb-4">{t("landing.footer.company")}</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-[#22c55e] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-lg mb-4">{t("landing.footer.support")}</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-[#22c55e] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-lg mb-4">{t("landing.footer.legal")}</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-[#22c55e] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Logo & Copyright */}
            <div className="flex items-center gap-3">
              <div className="text-3xl">🌾</div>
              <div>
                <div className="font-black text-xl">FarmGuard</div>
                <div className="text-xs text-white/50">
                  © 2024 FarmGuard. {t("landing.footer.rights")}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {["Twitter", "Facebook", "LinkedIn", "Instagram"].map((social) => (
                <motion.a
                  key={social}
                  href={`#${social.toLowerCase()}`}
                  whileHover={{ scale: 1.2, y: -2 }}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#22c55e] transition-colors"
                >
                  <span className="text-sm font-bold">{social[0]}</span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
