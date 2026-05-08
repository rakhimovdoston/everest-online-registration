# Everest Online Registration

Online registration platform for Everest Academy IELTS CDI Mock Test exams.

## About

A React SPA that allows students to register for Everest Academy CDI mock exams online. Users sign in with their phone number, choose a package, branch, and test dates, then complete payment — all in one flow.

## Tech Stack

| Library | Version | Purpose |
|---|---|---|
| React | 19.2.0 | UI framework |
| Vite | 7.2.4 | Build tool |
| React Router DOM | 7.12.0 | Client-side routing |
| Tailwind CSS | 3.4.19 | Styling |
| Framer Motion | 11.18.2 | Animations |
| React Hook Form + Zod | 7.70.0 + 3.25.76 | Form validation |
| Axios | 1.13.5 | HTTP requests |
| i18next | 25.7.4 | Internationalization (uz/ru/en) |
| Headless UI | 2.2.9 | Accessible UI components |

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=https://api.example.com
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── assets/              # Images, logos, PDF files
├── components/
│   ├── auth/            # LoginModal, ProtectedRoute, CompleteProfileModal
│   ├── forms/           # FormInput, OTPInput, PhoneInput, ...
│   ├── landing/         # HeroSection, Pricing, Testimonials, ...
│   ├── layout/          # Header, Footer
│   ├── profile/         # BookingCard
│   ├── review/          # SessionChangeModal
│   ├── ui/              # Button, Card, Accordion
│   └── upcoming/        # UpcomingBookingCard, UpcomingBookingBanner
├── contexts/
│   ├── AuthContext.jsx            # Auth state, login/logout
│   ├── AuthModalContext.jsx       # Login modal control
│   ├── PackageContext.jsx         # Packages, branches, test times
│   └── UpcomingBookingContext.jsx # Next upcoming test
├── locales/
│   ├── uz/translation.json        # Uzbek (default)
│   ├── ru/translation.json        # Russian
│   └── en/translation.json        # English
├── pages/
│   ├── Home.jsx
│   ├── Profile.jsx
│   └── TestRegistration/
│       ├── Step1Package.jsx        # Package selection
│       ├── Step2Branch.jsx         # Branch selection
│       ├── Step3Details.jsx        # Personal info + test dates
│       ├── Step4SpeakingDates.jsx  # Speaking dates + speaker
│       ├── Step5Review.jsx         # Review and create booking
│       └── Step6Payment.jsx        # Payment (Payme / Click / Uzum)
│   └── TestResults/
│       ├── ListeningResults.jsx
│       ├── ReadingResults.jsx
│       └── WritingResults.jsx
├── services/
│   └── api.js           # Axios instance, interceptors, API modules
├── utils/
│   ├── constants.js     # Static data
│   ├── pixel.js         # Facebook Pixel tracking
│   └── validationSchemas.js
├── App.jsx
├── i18n.js
└── main.jsx
```

## Authentication Flow

```
Phone number
    ↓
Send SMS code
    ↓
OTP verification (6 digits)
    ↓
Existing user  →  Login  →  Dashboard
    ↓
New user  →  Registration (first/last name + email  →  username + password)
```

Tokens are stored in `localStorage`. When the access token expires, the `api.js` interceptor automatically refreshes it using the refresh token. Concurrent requests that hit a 401 are queued and retried once the new token is obtained.

## Registration Flow

```
1. Package  →  2. Branch  →  3. Personal info + Test dates
                                        ↓
                             4. Speaking dates + Speaker
                                        ↓
                             5. Review  →  Create booking
                                        ↓
                             6. Payment (Payme / Click / Uzum)
```

Each step's data is persisted in `localStorage` so progress is not lost on page refresh.

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/auth/sms/send-code` | POST | Send SMS verification code |
| `/auth/sms/verify` | POST | Verify OTP code |
| `/auth/refresh-token` | POST | Refresh access token |
| `/user/profile` | GET | Get user profile |
| `/user/complete-registration` | POST | Complete new user registration |
| `/user/upcoming-booking` | GET | Get next upcoming test |
| `/branch/all` | GET | Get packages, branches, test times |
| `/branch/speakers/:branchId` | GET | Get branch speakers |
| `/branch/payment-methods` | GET | Get available payment methods |
| `/test-session/available` | GET | Get available test sessions |
| `/test-session/speaking/available` | GET | Get available speaking sessions |
| `/booking/save` | POST | Create a booking |
| `/booking/by-user` | GET | Get user's bookings |
| `/payment/methods/:bookingId` | GET | Get payment methods for booking |
| `/orders/payment/link` | POST | Get payment redirect URL |
| `/history/mock-exam/:sessionId` | GET | Get test results |

## Internationalization

The app supports three languages: **Uzbek** (default), **Russian**, and **English**. Language configuration is in `src/i18n.js` and translation files are located in `src/locales/`.
