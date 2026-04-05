"use client";

import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 3000);
  };

  return (
    <section className="py-32 bg-gradient-to-br from-emerald-50 via-white to-yellow-50/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2316a34a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.6 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl mb-8 shadow-2xl shadow-emerald-500/30"
          >
            <Mail size={40} className="text-white" />
          </motion.div>

          <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-6">
            Stay Updated with
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">
              Market Insights
            </span>
          </h2>

          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Get weekly market trends, pricing tips, and exclusive farming insights delivered to your inbox
          </p>

          {/* Newsletter Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full h-16 pl-12 pr-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium"
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={subscribed}
                className="h-16 px-8 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {subscribed ? (
                  "Subscribed! ✓"
                ) : (
                  <>
                    Subscribe
                    <ArrowRight size={20} />
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>

          <p className="text-sm text-gray-500 mt-6">
            Join 10,000+ farmers already receiving our insights. Unsubscribe anytime.
          </p>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-12 border-t border-gray-200"
          >
            <div className="text-center">
              <p className="text-3xl font-black text-gray-900">10K+</p>
              <p className="text-sm text-gray-600 font-semibold">Subscribers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-gray-900">Weekly</p>
              <p className="text-sm text-gray-600 font-semibold">Updates</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-gray-900">Free</p>
              <p className="text-sm text-gray-600 font-semibold">Forever</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
