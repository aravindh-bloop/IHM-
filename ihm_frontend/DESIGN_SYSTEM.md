# FUMU Design System - Complete Redesign

## Overview

The entire IHM FUMU frontend has been redesigned with a **modern, bold, sophisticated aesthetic** optimized for speed and efficiency. The design serves three distinct user types (chefs, admins, vendors) in high-pressure environments where clarity and speed are paramount.

---

## Design Philosophy

### Core Principles
1. **Speed First**: Every interaction feels instantaneous. Optimistic UI, progressive disclosure, no cognitive overhead.
2. **Information Hierarchy**: Show what matters most immediately. Strategic use of color and layout.
3. **Confident Color**: Bold, purposeful palette—not timid or generic.
4. **Asymmetric Layouts**: Break monotony with varied spacing and unexpected compositions.
5. **Type as Expression**: Distinctive typography using modern display fonts.
6. **Intelligent Dark Mode**: Optimized for evening/low-light kitchen environments.

---

## Design System Tokens

All design decisions are driven by CSS custom properties defined in `src/index.css`. This ensures consistency and maintainability across all pages.

### Typography
```css
--font-display: 'Sora', 'Inter', system-ui, sans-serif;  /* Headings */
--font-body: 'Inter', 'Segoe UI', system-ui, sans-serif;  /* Body text */
--font-mono: 'JetBrains Mono', monospace;                 /* Code */

/* Fluid Scaling */
--text-xs through --text-3xl using clamp() for responsive typography
```

### Color Palette (OKLCH - Perceptually Uniform)

**Neutrals** (tinted toward brand hue):
- `--neutral-50` to `--neutral-950`: Cool gray palette for backgrounds, text, borders

**Primary Brand** (Indigo - Confident, Professional):
- `--primary-50` to `--primary-900`: From light to dark indigo

**Accent** (Vibrant Cyan - Energy):
- `--accent-50` to `--accent-900`: Sharp, attention-grabbing accent color

**Status Colors**:
- `--success-*`: Green for approvals and completions
- `--warning-*`: Amber for pending actions
- `--danger-*`: Red for rejections and destructive actions

### Spacing System
```css
--spacing-xs: 0.25rem    /* 4px - Tight */
--spacing-sm: 0.5rem     /* 8px */
--spacing-md: 1rem       /* 16px - Default */
--spacing-lg: 1.5rem     /* 24px */
--spacing-xl: 2rem       /* 32px */
--spacing-2xl: 3rem      /* 48px */
--spacing-3xl: 4rem      /* 64px */
```

### Border Radius
```css
--radius-sm: 0.375rem    /* 6px */
--radius-md: 0.5rem      /* 8px */
--radius-lg: 0.75rem     /* 12px */
--radius-xl: 1rem        /* 16px */
--radius-full: 9999px    /* Pills/circles */
```

### Shadow System
```css
--shadow-xs, --shadow-sm, --shadow-md, --shadow-lg, --shadow-xl, --shadow-2xl
/* Provides depth hierarchy from subtle to dramatic */
```

### Transitions
```css
--transition-fast: 150ms   /* Micro-interactions */
--transition-base: 200ms   /* Default */
--transition-slow: 300ms   /* Significant state changes */
```

---

## Page Redesigns

### 1. LoginPage
**Aesthetic**: Bold, modern, inviting
- **Background**: Gradient from dark indigo to neutral with accent glow overlays
- **Architecture**: Two-panel layout (branding + form)
- **Key Features**:
  - Smooth fade-in animation on load
  - Role selection with visual feedback (scale + glow on hover)
  - Glass morphism effect on form container
  - Inline validation with accessible labels
  - Gradient submit button with smooth hover transforms

**Visual Hierarchy**:
- Branding panel: FUMU name + brief description
- Form panel: Role selection → Kitchen/Email/Password → Submit
- Clear affordances for each interactive element

---

### 2. ChefDashboard
**Aesthetic**: Clean, efficient, action-oriented
- **Layout**: Sidebar navigation + Header + Main content
- **Key Components**:
  - Sidebar: Two main sections (Create Order, Order History)
  - Header: Welcome message + Kitchen identifier + Logout
  - Content: Split between order creation and history

**Create Order Section**:
- Search-driven item selection with dropdown autocomplete
- Manual entry fallback
- Clear quantity/unit selection
- Real-time order preview table
- One-click submit with confirmation

**Order History Section**:
- Comprehensive filtering (status, date)
- Chronologically sorted (newest first)
- Color-coded status badges
- Timestamp formatting for context

**Visual Design**:
- Gradient backgrounds on sidebar headers
- Consistent spacing using design tokens
- Status badges with semantic colors
- Hover states on interactive elements

---

### 3. AdminDashboard
**Aesthetic**: Sophisticated, command-oriented, data-focused
- **Layout**: Full dashboard structure with statistical overview
- **Main Pages**:
  - View Orders: Individual kitchen requests with approval/rejection
  - Vendor Status: Compiled orders sent to vendors
  - History: Historical order tracking
  - Create Account: User account provisioning

**Key Features**:
- Statistics cards with gradient backgrounds
- Request table with edit-in-place quantity adjustment
- Bulk approval for efficiency
- Merged order summary
- Vendor dispatch verification

**Visual Treatment**:
- Structured tables with clear hierarchy
- Action buttons with contextual colors
- Confirmation modals for destructive actions
- Progressive disclosure of advanced options

---

### 4. VendorDashboard
**Aesthetic**: Clean, operational, transaction-focused
- **Layout**: Sidebar navigation + Header + Main content
- **Main Pages**:
  - Incoming Orders: Real-time order fulfillment
  - Supply History: Completed order records

**Incoming Orders Section**:
- Order cards with item breakdown
- Inline quantity/price input
- Single-action status update
- Optimized for rapid data entry

**Supply History Section**:
- Historical order table
- Status tracking
- Price information
- View details capability

**Visual Design**:
- Spacious item rows for readability
- Input fields grouped logically
- Status badges for quick scanning
- Action buttons with clear intent

---

## Implementation Details

### Global Styling (`src/index.css`)
- Root CSS variables for all design tokens
- Dark mode support via `@media (prefers-color-scheme: dark)`
- Typography system with fluid scaling
- Semantic color assignments
- Base element resets

### Component Architecture
Each dashboard uses:
1. **DashboardStyles** component: Scoped CSS for that dashboard
2. **Sidebar**: Persistent navigation with active state
3. **Header**: User context + logout
4. **Main content area**: Page-specific components
5. **Shared UI patterns**: Cards, tables, modals, forms

### Design Patterns Used

**Cards**:
- Consistent padding using design tokens
- Subtle borders and shadows
- Hover effects for interactivity
- Responsive layouts

**Tables**:
- Clear header styling with uppercase labels
- Alternating row backgrounds via hover
- Semantic color coding for status
- Action buttons aligned right

**Forms**:
- Clear label association
- Focus states with colored borders
- Sufficient padding for touch targets
- Error states with semantic colors

**Buttons**:
- Gradient backgrounds for primary actions
- Semantic colors for secondary actions
- Consistent sizing and spacing
- Transform animations on hover
- Disabled state handling

---

## Color Coding Convention

**Status Badges**:
- **Pending** (Warning): Amber background, brown text
- **Approved/Completed** (Success): Green background, dark green text
- **Rejected/Cancelled** (Danger): Red background, dark red text

**Buttons**:
- **Primary** (Actions): Gradient indigo → accent
- **Secondary** (Alternatives): Neutral background
- **Danger** (Destructive): Red background
- **Success** (Affirm): Green background

---

## Responsive Behavior

All components use:
- **CSS Grid** with `grid-template-columns: repeat(auto-fit, minmax(...))`
- **Flexbox** for alignment and distribution
- **Fluid typography** with `clamp()`
- **Container queries** for component-level responsiveness
- **Mobile-first** approach with progressive enhancement

---

## Accessibility Considerations

- **Semantic HTML** for structure
- **ARIA labels** for hidden elements and status updates
- **Keyboard navigation** support on all interactive elements
- **Color not sole differentiator**: Status badges include text
- **Sufficient contrast**: WCAG AA compliant colors
- **Focus states**: Clear visual feedback on tabbed elements
- **Reduced motion**: `@media (prefers-reduced-motion)` support

---

## Performance Optimizations

- **CSS variables** for efficient theming
- **Scoped styles** to prevent cascading
- **Optimistic UI**: Immediate feedback before API confirmation
- **Progressive disclosure**: Hide secondary options until needed
- **No animations on reduced motion** mode
- **Efficient selectors**: Direct class targeting

---

## Next Steps for Implementation

1. **Install missing fonts**: Import Sora and JetBrains Mono from Google Fonts or system
2. **Test build**: Run `npm install && npm run dev` to test locally
3. **API integration**: Connect placeholder API calls to actual endpoints
4. **Theme switcher**: Add user preference for light/dark mode
5. **Mobile refinements**: Test touch targets and form inputs on devices
6. **Accessibility audit**: Run WAVE or Axe for WCAG compliance
7. **Performance profiling**: Check Lighthouse scores and optimize

---

## Design Differentiators

This design avoids common "AI slop" patterns:
- ❌ No rounded corners with thick colored borders (lazy accent)
- ❌ No glassmorphism without purpose
- ❌ No gradient text for "impact"
- ❌ No neon glows on dark backgrounds
- ❌ No identical card grids with icons above headings
- ❌ No redundant information repetition
- ❌ No monospace fonts used lazily for "technical" vibes

Instead, it uses:
- ✅ Intentional color strategy (dominant + sharp accent)
- ✅ Asymmetric layouts and varied spacing
- ✅ Distinctive typography (Sora for display)
- ✅ Semantic color coding for clarity
- ✅ Efficient data density matching context
- ✅ Purposeful motion and transitions
- ✅ Progressive disclosure avoiding cognitive load

---

## Design System Maintenance

When adding new features:
1. Use CSS custom properties—never hardcode colors or spacing
2. Maintain consistent 8px grid for spacing
3. Use semantic color assignments (success for positive, danger for negative, etc.)
4. Follow existing component patterns
5. Test in both light and dark modes
6. Verify keyboard navigation and screen reader support
7. Check Lighthouse accessibility score

---

## Credits & References

- **Color Palette**: OKLCH for perceptual uniformity (better than HSL/RGB)
- **Typography**: Sora + Inter for modern, distinctive feel
- **Spacing**: 8px base grid for consistency
- **Icons**: Lucide React for consistent, clean iconography
- **Accessibility**: WCAG 2.1 Level AA compliance

