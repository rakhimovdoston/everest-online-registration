import { motion } from "framer-motion";
import { Mail, MapPin, Clock } from "lucide-react";
import { logo } from "../../assets";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "Features", href: "#features" },
      { label: "Exam Environment", href: "#exam-environment" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
    company: [
      { label: "About Us", href: "#about" },
      { label: "Contact", href: "#contact" },
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" },
    ],
    support: [
      { label: "Help Center", href: "#help" },
      { label: "System Requirements", href: "#system" },
      { label: "Technical Support", href: "#support" },
      { label: "Report Issue", href: "#report" },
    ],
  };

  return (
    <footer className="relative bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <Link to={"/"}>
                <img
                  src={logo}
                  alt="Everest Online Registration Logo"
                  height={200}
                  width={150}
                />
              </Link>
              <div></div>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed max-w-sm">
              The most authentic IELTS Computer-Delivered test simulation
              platform. Practice with confidence, score with precision.
            </p>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a
                  href="mailto:support@everestmock.com"
                  className="hover:text-white transition-colors"
                >
                  support@everestmock.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>24/7 AI Support Available</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>Serving students worldwide</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {currentYear} Everest Mock. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span>Made with precision for IELTS success</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
    </footer>
  );
};

export default Footer;
