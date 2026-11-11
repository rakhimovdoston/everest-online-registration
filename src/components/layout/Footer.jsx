import { Instagram, Phone, Send, Youtube } from "lucide-react";
import { footer_logo } from "../../assets";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();

  const lang = i18n.language?.slice(0, 2);
  const aboutUrl = `https://everestlc.uz/${lang === "ru" ? "ru" : lang === "en" ? "en" : "uz"}/about`;

  const contactLinks = [
    {
      label: "78 888 8008",
      href: "tel:+998788888008",
      icon: Phone,
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/everest_learning_center/",
      icon: Instagram,
      external: true,
    },
    {
      label: "Telegram",
      href: "https://t.me/everestofficial",
      icon: Send,
      external: true,
    },
    {
      label: "YouTube",
      href: "https://www.youtube.com/@everest_official",
      icon: Youtube,
      external: true,
    },
  ];

  return (
    <footer className="bg-ink px-5 text-white">
      <div className="mx-auto max-w-[1200px]">
        {/* Main Footer Content */}
        <div className="flex flex-col justify-between gap-10 py-12 md:flex-row md:py-14">
          {/* Brand Column */}
          <div>
            <Link to={"/"} className="mb-5 inline-block">
              <img
                src={footer_logo}
                alt="Everest Online Registration Logo"
                className="h-auto w-[135px]"
              />
            </Link>
            <p className="max-w-lg text-[15px] font-medium leading-relaxed text-ink-muted">
              {t("footer.description")}
            </p>
          </div>

          {/* Company + Contact */}
          <div className="flex gap-12">
            {/* Company Links */}
            <div>
              <h4 className="mb-4 font-bold">{t("footer.company")}</h4>
              <a
                href={aboutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-ink-muted transition-colors hover:text-white"
              >
                {t("footer.aboutUs")}
              </a>
            </div>

            {/* Contact Links */}
            <div>
              <h4 className="mb-4 font-bold">{t("footer.contact")}</h4>
              <ul className="space-y-3">
                {contactLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="flex items-center gap-2.5 text-sm font-medium text-ink-muted transition-colors hover:text-white"
                      >
                        <Icon className="h-4 w-4" />
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
        <div className="border-t border-white/15 py-6">
          <p className="text-sm font-medium text-ink-muted">
            {t("footer.allRightsReserved").replace("{year}", currentYear)}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
