# Design Reference Guide

## Color Palette Reference

### Portfolio Color System

#### Primary Colors
| Color | HSL | RGB | Usage |
|-------|-----|-----|-------|
| Vibrant Blue | 217 100% 55% | #0066FF | Main CTA buttons, primary accents |
| Purple | 262 80% 50% | #8B5CF6 | Secondary accents, gradients |
| Golden Yellow | 46 100% 55% | #FBBF24 | Highlight accents, special elements |

#### Background Colors
| Color | HSL | RGB | Usage |
|-------|-----|-----|-------|
| Light Slate | 210 40% 98% | #F8FAFC | Main background |
| Blue Tint | - | - | Hero section background |
| Purple Tint | - | - | Experience section background |
| Emerald Tint | - | - | Education section background |

### Admin Color System

#### Primary Colors
| Color | HSL | RGB | Usage |
|-------|-----|-----|-------|
| Professional Blue | 220 90% 45% | #1E40AF | Primary buttons, navigation |
| Slate | 220 13% 20% | #1F2937 | Text, secondary elements |
| Light Gray-Blue | 210 20% 96% | #F3F4F6 | Background |

## Section-Specific Color Schemes

### Hero Section
```
Background: Gradient from-slate-50 via-blue-50 to-purple-50
Title: Gradient from-slate-900 via-blue-600 to-purple-600
CTA Button: Gradient from-blue-600 to-purple-600
Secondary Button: Border blue-600, hover purple-600
```

### Projects Section
```
Background: Gradient from-white via-blue-50 to-white
Accent Line: Gradient from-blue-600 to-purple-600

Project Cards (Rotating):
1. Blue Theme: bg-gradient-to-br from-blue-50 to-blue-100
2. Purple Theme: bg-gradient-to-br from-purple-50 to-purple-100
3. Emerald Theme: bg-gradient-to-br from-emerald-50 to-emerald-100
4. Orange Theme: bg-gradient-to-br from-orange-50 to-orange-100

Tech Badges: Gradient from-[color]-500 to-[color]-600
Demo Button: Gradient from-blue-600 to-purple-600
```

### Skills Section
```
Background: Gradient from-slate-50 via-white to-blue-50
Accent Line: Gradient from-blue-600 to-purple-600

Skill Categories:
- Backend: Blue gradient (from-blue-100 to-blue-50)
- Frontend: Purple gradient (from-purple-100 to-purple-50)
- DevOps: Emerald gradient (from-emerald-100 to-emerald-50)
- Tools: Orange gradient (from-orange-100 to-orange-50)

Borders: 2px with matching color
Skill Dots: Gradient from-blue-600 to-purple-600
```

### Experience Section
```
Background: Gradient from-white via-purple-50 to-white
Accent Line: Gradient from-blue-600 to-purple-600

Experience 1: Blue theme (border-blue-200, bg-gradient-to-br from-blue-50 to-white)
Experience 2: Purple theme (border-purple-200, bg-gradient-to-br from-purple-50 to-white)

Responsibility Badges: Gradient backgrounds with matching borders
```

### Education Section
```
Background: Gradient from-white via-emerald-50 to-white
Accent Line: Gradient from-blue-600 to-purple-600

Main Card: Emerald theme (border-emerald-200, bg-gradient-to-br from-emerald-50 to-white)
Focus Areas: Emerald borders with gradient indicators
```

### About Section
```
Background: Gradient from-white via-blue-50 to-white
Accent Line: Gradient from-blue-600 to-purple-600

Stat Cards (Rotating):
1. Experience: Blue (bg-gradient-to-br from-blue-100 to-blue-50)
2. Projects: Purple (bg-gradient-to-br from-purple-100 to-purple-50)
3. Professional: Pink (bg-gradient-to-br from-pink-100 to-pink-50)
4. Commitment: Orange (bg-gradient-to-br from-orange-100 to-orange-50)

Borders: 2px with matching color
```

### Contact Section
```
Background: Gradient from-white via-blue-50 to-white
Accent Line: Gradient from-blue-600 to-purple-600

Contact Info Cards: Gradient backgrounds (blue, purple, emerald)
Availability Badge: Emerald theme
Form: Blue theme (border-blue-200, bg-gradient-to-br from-blue-50 to-white)
Submit Button: Gradient from-blue-600 to-purple-600
```

## Admin Interface Colors

### Admin Dashboard
```
Header: White background with shadow
Admin Badge: Gradient from-blue-600 to-blue-700
Navigation: Gradient from-blue-600 to-blue-700 (active state)

Overview Cards:
- Projects: Blue gradient (from-blue-50 to-white)
- Messages: Slate theme (from-slate-50 to-white)

Welcome Message: Blue accent text
```

### Admin Login
```
Background: Gradient from-slate-50 via-blue-50 to-slate-50
Card: White with blue border (2px)
Admin Icon: Gradient from-blue-600 to-blue-700

Form Inputs: 2px border-slate-200, focus:border-blue-500
Submit Button: Gradient from-blue-600 to-blue-700
```

## Typography & Spacing

### Headings
- H1: text-5xl md:text-6xl font-black
- H2: text-4xl md:text-5xl font-black
- H3: text-2xl md:text-3xl font-black
- H4: text-xl font-black

### Accent Lines
- Height: h-1
- Width: w-16
- Border Radius: rounded-full
- Gradient: from-blue-600 to-purple-600

### Buttons
- Padding: px-8 py-3 (primary), px-4 py-2 (secondary)
- Border Radius: rounded-lg
- Font: font-bold text-sm
- Transitions: hover:shadow-lg, hover:scale-105

## Hover & Interactive States

### Cards
```
Default: border-slate-200, shadow-none
Hover: border-primary/50, shadow-lg, -translate-y-1
```

### Buttons
```
Default: bg-[color]-600
Hover: bg-[color]-700, shadow-lg
Active: scale-0.95
```

### Icons
```
Default: opacity-100
Hover: scale-110, transition-transform
```

## Responsive Breakpoints

- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (md, lg)
- Desktop: > 1024px (xl)

All sections use responsive grid layouts:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns

## Accessibility Considerations

- Minimum contrast ratio: 4.5:1 for text
- Focus states: Visible outline or color change
- Color not sole indicator: Icons and text used together
- Sufficient spacing: Minimum 8px between interactive elements

## Animation & Transitions

### Fade In Effects
```
Initial: opacity-0, y-20
Animate: opacity-1, y-0
Duration: 0.6s ease-out
```

### Hover Transitions
```
Duration: 300-500ms
Easing: ease-in-out
Properties: color, shadow, transform
```

### Gradient Animations
```
Duration: 8s
Easing: ease infinite
Background-position: 0% 50% → 100% 50% → 0% 50%
```

## Best Practices

1. **Consistency**: Use the same color for similar elements across sections
2. **Hierarchy**: Brighter colors for important elements
3. **Contrast**: Ensure text is readable on all backgrounds
4. **Gradients**: Use gradients to add depth and visual interest
5. **Spacing**: Maintain consistent padding and margins
6. **Transitions**: Smooth animations enhance user experience
7. **Responsive**: Test on all device sizes
8. **Accessibility**: Verify color contrast and keyboard navigation
