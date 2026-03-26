import { Instagram, Send, Youtube } from "lucide-react";
import { logo } from "../../assets";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();

  const lang = i18n.language?.slice(0, 2);
  const aboutUrl = `https://everestlc.uz/${lang === "ru" ? "ru" : lang === "en" ? "en" : "uz"}/about`;

  const socialLinks = [
    {
      label: "Instagram",
      href: "https://www.instagram.com/everest_learning_center/",
      icon: Instagram,
    },
    {
      label: "Telegram",
      href: "https://t.me/everestofficial",
      icon: Send,
    },
    {
      label: "YouTube",
      href: "https://www.youtube.com/@everest_official",
      icon: Youtube,
    },
  ];

  return (
    <footer className="relative bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid md:grid-cols-2 gap-12">
          {/* Brand Column */}
          <div>
            <div className="mb-4">
              <Link to={"/"}>
                <img
                  src={logo}
                  alt="Everest Online Registration Logo"
                  height={200}
                  width={150}
                />
              </Link>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed max-w-sm">
              {t("footer.description")}
            </p>
          </div>

          {/* Company + Social */}
          <div className="flex flex-col sm:flex-row gap-12">
            {/* Company Links */}
            <div>
              <h4 className="font-semibold mb-4">{t("footer.company")}</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href={aboutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {t("footer.aboutUs")}
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold mb-4">{t("footer.contact")}</h4>
              <ul className="space-y-3">
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 py-8">
          <p className="text-sm text-slate-500">
            &copy; {currentYear} Everest Mock.
          </p>
        </div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
    </footer>
  );
};

export default Footer;
