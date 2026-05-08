# Everest Online Registration

IELTS CDI Mock Test imtihoniga onlayn ro'yxatdan o'tish platformasi.

## Loyiha haqida

Everest Academy CDI mock imtihonlariga o'quvchilarni onlayn ro'yxatdan o'tkazish uchun yaratilgan React SPA. Foydalanuvchilar telefon raqami orqali tizimga kirib, o'zlariga mos paket, filial va test sanalarini tanlab, onlayn to'lov qilishadi.

## Tech Stack

| Kutubxona | Versiya | Maqsad |
|---|---|---|
| React | 19.2.0 | UI framework |
| Vite | 7.2.4 | Build tool |
| React Router DOM | 7.12.0 | Client-side routing |
| Tailwind CSS | 3.4.19 | Styling |
| Framer Motion | 11.18.2 | Animatsiyalar |
| React Hook Form + Zod | 7.70.0 + 3.25.76 | Form validatsiya |
| Axios | 1.13.5 | HTTP requests |
| i18next | 25.7.4 | Ko'p tillilik (uz/ru/en) |
| Headless UI | 2.2.9 | Accessible UI komponentlar |

## Muhit o'zgaruvchilari

`.env` faylini yarating:

```env
VITE_API_URL=https://api.example.com
```

## O'rnatish va ishga tushirish

```bash
# Dependencylarni o'rnatish
npm install

# Development server
npm run dev

# Production build
npm run build

# Build preview
npm run preview
```

## Loyiha tuzilishi

```
src/
├── assets/              # Rasmlar, logolar, PDF
├── components/
│   ├── auth/            # LoginModal, ProtectedRoute, CompleteProfileModal
│   ├── forms/           # FormInput, OTPInput, PhoneInput ...
│   ├── landing/         # HeroSection, Pricing, Testimonials ...
│   ├── layout/          # Header, Footer
│   ├── profile/         # BookingCard
│   ├── review/          # SessionChangeModal
│   ├── ui/              # Button, Card, Accordion
│   └── upcoming/        # UpcomingBookingCard, UpcomingBookingBanner
├── contexts/
│   ├── AuthContext.jsx          # Auth holati, login/logout
│   ├── AuthModalContext.jsx     # Login modal boshqaruvi
│   ├── PackageContext.jsx       # Packages, branches, testTimes
│   └── UpcomingBookingContext.jsx
├── hooks/
│   └── useIntersectionObserver.js
├── locales/
│   ├── uz/translation.json     # O'zbek (default)
│   ├── ru/translation.json     # Rus
│   └── en/translation.json     # Ingliz
├── pages/
│   ├── Home.jsx
│   ├── Profile.jsx
│   └── TestRegistration/
│       ├── Step1Package.jsx     # Paket tanlash
│       ├── Step2Branch.jsx      # Filial tanlash
│       ├── Step3Details.jsx     # Shaxsiy ma'lumot + test sanalari
│       ├── Step4SpeakingDates.jsx  # Speaking sanalari + speaker
│       ├── Step5Review.jsx      # Ko'rib chiqish va booking yaratish
│       └── Step6Payment.jsx     # To'lov (Payme / Click / Uzum)
│   └── TestResults/
│       ├── ListeningResults.jsx
│       ├── ReadingResults.jsx
│       └── WritingResults.jsx
├── services/
│   └── api.js           # Axios instance, interceptors, API modullar
├── utils/
│   ├── constants.js     # Static data
│   ├── pixel.js         # Facebook Pixel tracking
│   └── validationSchemas.js
├── App.jsx
├── i18n.js
└── main.jsx
```

## Autentifikatsiya oqimi

```
Telefon raqam
    ↓
SMS kod yuborish
    ↓
OTP tasdiqlash (6 raqam)
    ↓
Mavjud foydalanuvchi → Login → Dashboard
    ↓
Yangi foydalanuvchi → Ro'yxat (ism/familiya/email → username/parol)
```

Tokenlar `localStorage`da saqlanadi. Access token expired bo'lganda `api.js` interceptor avtomatik refresh qiladi.

## Test ro'yxatdan o'tish oqimi

```
1. Paket tanlash  →  2. Filial  →  3. Shaxsiy ma'lumot + Test sanalari
                                                ↓
                              4. Speaking sanalari + Speaker
                                                ↓
                              5. Ko'rib chiqish → Booking yaratish
                                                ↓
                              6. To'lov (Payme / Click / Uzum)
```

Har bosqich ma'lumotlari `localStorage`ga saqlanadi. Foydalanuvchi brauzer yopsa ham ma'lumotlar saqlanib qoladi.

## API Endpointlar

| Endpoint | Metod | Tavsif |
|---|---|---|
| `/auth/sms/send-code` | POST | SMS kod yuborish |
| `/auth/sms/verify` | POST | OTP tasdiqlash |
| `/auth/refresh-token` | POST | Token yangilash |
| `/user/profile` | GET | Profil ma'lumotlari |
| `/user/complete-registration` | POST | Ro'yxatni yakunlash |
| `/user/upcoming-booking` | GET | Keyingi test |
| `/branch/all` | GET | Paketlar, filiallar, vaqtlar |
| `/branch/speakers/:branchId` | GET | Filial speakerlari |
| `/branch/payment-methods` | GET | To'lov usullari |
| `/test-session/available` | GET | Mavjud test sessiyalari |
| `/test-session/speaking/available` | GET | Mavjud speaking sessiyalari |
| `/booking/save` | POST | Booking yaratish |
| `/booking/by-user` | GET | Foydalanuvchi bookinglari |
| `/payment/methods/:bookingId` | GET | Booking to'lov usullari |
| `/orders/payment/link` | POST | To'lov havolasi olish |
| `/history/mock-exam/:sessionId` | GET | Test natijalari |

## Ko'p tillilik

Dastur 3 tilda ishlaydi: O'zbek (default), Rus, Ingliz. Til `src/i18n.js` da sozlanadi, tarjimalar `src/locales/` papkasida joylashgan.
