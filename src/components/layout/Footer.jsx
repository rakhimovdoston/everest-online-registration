import { Mail, MapPin, Clock } from "lucide-react";
import { logo } from "../../assets";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: t("footer.aboutUs"), href: "#about" },
      { label: t("footer.contact"), href: "#contact" },
      { label: t("footer.privacyPolicy"), href: "#privacy" },
      { label: t("footer.termsOfService"), href: "#terms" },
    ],
    support: [
      { label: t("footer.helpCenter"), href: "#help" },
      { label: t("footer.technicalSupport"), href: "#support" },
      { label: t("footer.reportIssue"), href: "#report" },
    ],
  };

  return (
    <footer className="relative bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-12">
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
              {t("footer.description")}
            </p>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a
                  href="mailto:support@everestmock.com"
                  className="hover:text-white transition-colors"
                >
                  {t("footer.email")}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>{t("footer.aiSupport")}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>{t("footer.servingStudents")}</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer.company")}</h4>
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
            <h4 className="font-semibold mb-4">{t("footer.support")}</h4>
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
              &copy; {currentYear} Everest Mock. {t("footer.allRightsReserved")}
            </p>
          </div>
        </div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
    </footer>
  );
};

export default Footer;
