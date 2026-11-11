import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, User, LogOut, ClipboardList, ChevronDown } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { useAuthModal } from "../../contexts/AuthModalContext";
import { logo } from "../../assets";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const { openLoginModal } = useAuthModal();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const languages = [
    { code: "uz", name: "O'zbek" },
    { code: "ru", name: "Русский" },
    { code: "en", name: "English" },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsLanguageMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePricingClick = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (location.pathname === "/") {
      // Already on home — just scroll
      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
    } else {
      // Navigate to home, then scroll after render
      navigate("/");
      setTimeout(() => {
        document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const navItems = [
    {
      label: t("header.testRegistration"),
      href: "/test-registration",
      isLink: true,
    },
    { label: t("header.pricing"), href: "#pricing", onClick: handlePricingClick },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
        isScrolled ? "shadow-[0_1px_0_#E6E8EB]" : ""
      }`}
    >
      <nav className="mx-auto max-w-[1200px] px-5">
        <div className="flex h-[70px] items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Everest Online Registration Logo" className="h-auto w-[72px]" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-7 md:flex">
            {navItems.map((item) =>
              item.isLink ? (
                <Link
                  key={item.label}
                  to={item.href}
                  className="whitespace-nowrap text-sm font-medium text-ink transition-colors duration-200 hover:text-indigo-600"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={item.onClick}
                  className="cursor-pointer whitespace-nowrap text-sm font-medium text-ink transition-colors duration-200 hover:text-indigo-600"
                >
                  {item.label}
                </a>
              )
            )}
            {isAuthenticated && (
              <Link
                to="/profile"
                className="flex items-center gap-1.5 whitespace-nowrap text-sm font-medium text-ink transition-colors duration-200 hover:text-indigo-600"
              >
                <ClipboardList className="h-4 w-4" />
                {t("header.testHistory")}
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                className="inline-flex items-center gap-1.5 rounded-lg py-2 text-sm font-semibold text-ink transition-colors duration-200 hover:text-indigo-600"
                aria-expanded={isLanguageMenuOpen}
              >
                <Globe className="h-4 w-4 text-ink-soft" />
                <span>{currentLanguage.code.toUpperCase()}</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isLanguageMenuOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isLanguageMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 z-50 mt-2 w-36 rounded-xl border border-line bg-white p-1 shadow-lg"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                          i18n.language === lang.code
                            ? "bg-indigo-50 font-medium text-indigo-600"
                            : "text-ink hover:bg-surface"
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop account */}
            <div className="hidden md:block">
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="inline-flex items-center gap-2 rounded-xl bg-control px-4 py-2.5 text-sm font-semibold text-ink transition-colors duration-200 hover:bg-control-hover"
                  >
                    <User className="h-4 w-4" />
                    <span>{user.firstName} {user.lastName}</span>
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-line bg-white p-1 shadow-lg"
                      >
                        <Link
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-ink hover:bg-surface"
                        >
                          <User className="h-4 w-4" />
                          <span>{t("header.myProfile")}</span>
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            navigate("/");
                            setIsUserMenuOpen(false);
                          }}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-600 hover:bg-surface"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>{t("header.logout")}</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => openLoginModal()}
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-indigo-700"
                >
                  {t("header.signIn")}
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-11 items-center gap-1.5 rounded-xl border border-line px-2.5 text-ink transition-colors hover:bg-surface md:hidden"
              aria-label="Menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <User className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-line bg-white md:hidden"
            >
              <div className="space-y-1 py-4">
                {navItems.map((item) =>
                  item.isLink ? (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block rounded-lg px-3 py-3 text-ink transition-colors hover:bg-surface"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={item.onClick}
                      className="block cursor-pointer rounded-lg px-3 py-3 text-ink transition-colors hover:bg-surface"
                    >
                      {item.label}
                    </a>
                  )
                )}
                <div className="space-y-2 pt-2">
                  {isAuthenticated && user ? (
                    <>
                      <div className="py-2 text-center text-sm font-medium text-ink">
                        {user.firstName} {user.lastName}
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full rounded-xl bg-indigo-600 px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                      >
                        {t("header.myProfile")}
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-control px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-control-hover"
                      >
                        <ClipboardList className="h-4 w-4" />
                        {t("header.testHistory")}
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          navigate("/");
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full rounded-xl bg-red-600 px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-red-700"
                      >
                        {t("header.logout")}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          openLoginModal();
                        }}
                        className="block w-full rounded-xl bg-control px-6 py-3 text-center text-sm font-semibold text-ink transition-colors hover:bg-control-hover"
                      >
                        {t("header.signIn")}
                      </button>
                      <Link
                        to="/test-registration"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full rounded-xl bg-indigo-600 px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                      >
                        {t("header.register")}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Header;
