# Everest Mock - Premium IELTS Landing Page

## Overview
A premium, minimalist landing page for Everest Mock - an IELTS Computer-Delivered test simulation platform. Built with React, Tailwind CSS, and Framer Motion.

## Design Philosophy: "Academic Minimalism"

### Visual Identity
- **Vibe**: Trustworthy, Serious, Calm, High-end
- **Inspiration**: Linear App meets British Council aesthetic
- **Color Palette**:
  - Primary: Midnight Blue (`slate-900`)
  - Accent: Electric Indigo (`indigo-600`)
  - Background: White / Very Light Gray (`slate-50`)
  - Text: High contrast dark grays (`slate-800`, `slate-600`)

### Design Principles
- Extensive whitespace and negative space
- Subtle borders and soft shadows
- Glassmorphism effects for floating elements
- No clutter - every element has a purpose
- Mobile-first responsive design

## Tech Stack

- **Framework**: React 19.2 (Functional Components)
- **Styling**: Tailwind CSS 3.4
- **Animation**: Framer Motion 11.18
- **Icons**: Lucide React
- **Build Tool**: Vite 7.2

## Page Structure

### 1. Header (Navbar)
**File**: `src/components/layout/Header.jsx`

Features:
- Sticky header with blur backdrop
- Smooth scroll-triggered background change
- Mobile-responsive hamburger menu
- CTA button with hover glow effect
- Navigation links: Features, Exam Environment, Pricing, FAQ

### 2. Hero Section
**File**: `src/components/landing/HeroSection.jsx`

Features:
- Large, confident typography with gradient accent
- Floating 3D exam interface mockup with mouse parallax
- Staggered fade-up animations
- Animated floating badges (AI Accuracy, Instant Score)
- Dual CTA buttons (primary and secondary)
- Background grid pattern
- Responsive layout (stacks on mobile)

Animations:
- Text: Staggered fade-up (0.1s delay between elements)
- Mockup: Continuous floating animation (4s duration)
- Mouse parallax effect on exam interface
- Badges: Independent floating animations

### 3. Value Proposition (Features)
**File**: `src/components/landing/ValueProposition.jsx`

Features:
- 6-card grid layout (3 columns on desktop, stacks on mobile)
- Each card with unique gradient accent
- Icon-based visual hierarchy
- Hover effects with lift animation
- Staggered entrance animations

Feature Cards:
1. Real Exam Interface
2. AI-Powered Scoring
3. Speaking Simulation
4. Writing Task Evaluation
5. Authentic Listening Tests
6. Performance Analytics

### 4. Exam Environment Showcase
**File**: `src/components/landing/ExamEnvironment.jsx`

Features:
- Tabbed interface with 4 modules (Listening, Reading, Writing, Speaking)
- Browser-style window mockup with traffic light controls
- Smooth tab transitions with AnimatePresence
- Progress bars for each module
- Interactive UI mockups for each test type
- Real-time interface updates badge

Tab Content:
- **Listening**: Audio player, timer, fill-in-the-blank questions
- **Reading**: Passage text, multiple choice questions
- **Writing**: Essay prompt, word counter, text area
- **Speaking**: Topic card, recording interface with timer

### 5. Testimonials (Social Proof)
**File**: `src/components/landing/Testimonials.jsx`

Features:
- 6 testimonial cards in 3-column grid
- Student progression (Band score before → after)
- Gradient avatars with initials
- 5-star ratings
- Animated blob background effects
- Stats section at bottom (10,000+ students, 1.2 band increase, 98.5% accuracy)

### 6. Pricing
**File**: `src/components/landing/Pricing.jsx`

Features:
- 3-tier pricing (Free, Pro, Ultimate)
- "Most Popular" badge on Pro plan
- Feature lists with checkmarks
- Hover lift effects
- Gradient CTA buttons
- Money-back guarantee mention

Plans:
- **Free Trial**: $0 - One complete mock test
- **Pro**: $29/month - Unlimited tests (POPULAR)
- **Ultimate**: $79/3 months - Everything + coaching

### 7. FAQ Section
**File**: `src/components/landing/FAQSection.jsx`

Features:
- Smooth accordion with expand/collapse
- Plus/Minus icon toggle
- 8 frequently asked questions
- Contact support CTA at bottom

Questions cover:
- Interface authenticity
- AI scoring accuracy
- Module flexibility
- Speaking functionality
- Platform differentiation
- Writing feedback
- Test limits
- Mobile availability

### 8. Footer
**File**: `src/components/layout/Footer.jsx`

Features:
- Dark theme (slate-900)
- 5-column grid layout
- Links organized by category (Product, Company, Support)
- Contact information with icons
- Decorative gradient bottom border
- Copyright and tagline

## Key Animations & Interactions

### Framer Motion Patterns Used

1. **Fade-up entrance**:
```jsx
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.6 }}
```

2. **Hover lift**:
```jsx
whileHover={{ y: -4 }}
```

3. **Button interactions**:
```jsx
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}
```

4. **Continuous floating**:
```jsx
animate={{ y: [0, -10, 0] }}
transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
```

5. **Staggered children**:
```jsx
variants={containerVariants}
initial="hidden"
whileInView="visible"
```

### Scroll-triggered Animations
- All sections use `whileInView` to trigger on scroll
- `viewport={{ once: true }}` prevents re-triggering
- Staggered delays for list items

### Interactive Elements
- Navbar: Scroll-triggered background change
- Hero mockup: Mouse parallax effect
- Exam tabs: Smooth content transitions
- FAQ accordion: Height animation
- All CTAs: Hover and tap feedback

## Styling Highlights

### Glassmorphism
```jsx
className="bg-white/80 backdrop-blur-md"
```

### Gradients
- Text gradients: `bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600`
- Button gradients: `bg-gradient-to-r from-indigo-600 to-violet-600`
- Background gradients: `bg-gradient-to-b from-slate-50 to-white`

### Shadows
- Subtle: `shadow-sm`
- Cards: `shadow-xl`
- Colored: `shadow-lg shadow-indigo-500/30`

### Borders
- Subtle: `border border-slate-200`
- Accent: `border-2 border-indigo-600`

### Rounded Corners
- Cards: `rounded-2xl`
- Buttons: `rounded-full`
- Large containers: `rounded-3xl`

## Responsive Breakpoints

- Mobile: Default (< 768px)
- Tablet: `md:` (≥ 768px)
- Desktop: `lg:` (≥ 1024px)
- Large Desktop: `xl:` (≥ 1280px)

### Grid Behavior
- Hero: 1 column → 2 columns (lg)
- Features: 1 column → 2 columns (md) → 3 columns (lg)
- Testimonials: 1 column → 2 columns (md) → 3 columns (lg)
- Pricing: 1 column → 3 columns (md)
- Footer: 1 column → 2 columns (md) → 5 columns (lg)

## Performance Optimizations

1. **Lazy animations**: Only animate when in viewport
2. **Transform animations**: Using `transform` properties for better performance
3. **Will-change**: Implicit via Framer Motion
4. **Reduced motion**: Respects user preferences (via Framer Motion)
5. **Optimized re-renders**: Functional components with proper dependencies

## File Structure

```
src/
├── components/
│   ├── landing/
│   │   ├── HeroSection.jsx
│   │   ├── ValueProposition.jsx
│   │   ├── ExamEnvironment.jsx
│   │   ├── Testimonials.jsx
│   │   ├── Pricing.jsx
│   │   └── FAQSection.jsx
│   └── layout/
│       ├── Header.jsx
│       └── Footer.jsx
├── App.jsx
└── main.jsx
```

## Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The development server will start at `http://localhost:5173` (or next available port).

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 14+, Chrome Android

## Accessibility Features

- Semantic HTML throughout
- Keyboard navigation support
- Focus states on interactive elements
- Alt text on icons (via aria-labels where needed)
- Sufficient color contrast ratios
- Reduced motion support (via Framer Motion)

## Future Enhancements

1. Add scroll progress indicator
2. Implement dark mode toggle
3. Add micro-interactions on form inputs
4. Create a blog section
5. Add video testimonials
6. Implement A/B testing for CTAs
7. Add analytics tracking
8. Create custom 404 page

## Credits

- Design Philosophy: Inspired by Linear, British Council, and modern SaaS platforms
- Icons: Lucide React
- Animations: Framer Motion
- Styling: Tailwind CSS

---

**Built with precision for IELTS success** 🎯
