# Design System - Green Shade Theme 🌿

## Color Palette

### Primary Colors
- **Primary**: `#10d981` - Vibrant Emerald Green (Main CTA, Focus states)
- **Primary Deep**: `#059669` - Forest Green (Hover states for primary)
- **Primary Glow**: `#10d981` - Emerald Glow (Neon effect)

### Accent Colors
- **Accent**: `#34d399` - Jade Green (Secondary highlights)
- **Accent Alt**: `#6ee7b7` - Mint Green (Tags, tertiary elements)
- **Accent Warm**: `#10b981` - Teal Green (Info callouts)

### Background Colors
- **Background**: `#0a1410` - Deep Forest (Main background)
- **Surface**: `rgba(15, 30, 25, 0.65)` - Forest Glass (Glass morphism)
- **Surface Strong**: `rgba(20, 45, 35, 0.8)` - Stronger Forest Glass
- **Surface Muted**: `rgba(10, 25, 20, 0.5)` - Muted Forest

### Text Colors
- **Text**: `#e8f1ed` - Light Mint (Primary text)
- **Text Secondary**: `#b4d9c5` - Soft Mint (Secondary text)
- **Muted**: `#7a9f8f` - Muted Green (Tertiary text)

### Effects
- **Glow Cyan**: `0 0 20px rgba(16, 217, 129, 0.4)` - Green glow effect
- **Glow Magenta**: `0 0 20px rgba(52, 211, 153, 0.3)` - Jade glow effect

## Typography

### Font Families
- **Display**: "Space Grotesk" (Headlines - bold, modern, tech-forward)
- **Sans**: "Inter" (Body - clean, readable, professional)

### Font Weights & Sizes
- Headlines (h1-h6): Weight 800, Letter-spacing -0.5px
- Buttons: Weight 700, Uppercase, Letter-spacing 0.5px
- Body: Weight 400
- Small/Tiny: 0.88rem

## Component Styles

### Glass Morphism
- Backdrop Filter: `blur(25px)`
- Border: 1px solid `var(--line)` with 15% opacity green
- Box Shadow: Layered - base shadow + green glow + inset highlight
- Transitions: 0.3s cubic-bezier(0.4, 0, 0.2, 1)

### Buttons
- **Primary**: Green gradient with glow effect, animated gradient-shift
- **Secondary**: Transparent with green border and inset glow
- **Ghost**: Minimal with hover state upgrade to secondary style

### Cards
- Gradient background: Green tones with 80% to 60% opacity
- Border: 1px solid line color
- Inset shadow: Green highlight on top
- Hover: Enhanced border color, stronger glow

### Input/Textarea
- Background: Semi-transparent green glass
- Border: 1.5px solid line color
- Focus: Green border + box shadow + inset glow

### Tags
- Background: Linear gradient from jade to mint with 15% to 5% opacity
- Border: 1px solid jade (30% opacity)
- Glow: `0 0 15px rgba(52, 211, 153, 0.2)`
- Text: Mint green with capitalize text-transform

## Animations

### Keyframes
- **glow-pulse**: 2s ease-in-out - box-shadow pulsing green
- **neon-glow**: 3s ease-in-out - text-shadow green and jade glow
- **gradient-shift**: 3s infinite - animated gradient movement
- **float**: Vertical floating motion (unused, available)

### Applied Animations
- `.glass:hover` - glow-pulse animation
- `.button.primary` - gradient-shift animation
- `.pill` - neon-glow animation

## Spacing & Radius

- **Border Radius Large**: 20px (Panels, glass containers)
- **Border Radius Medium**: 14px (Cards, larger inputs)
- **Border Radius Small**: 10px (Small inputs, interactive elements)

- **Gap Large**: 24px
- **Gap Medium**: 18px
- **Gap Small**: 12px
- **Gap Tiny**: 8px

## Responsive Design

### Breakpoint
- Max-width: 1100px

Stacks to single column:
- `.hero-grid`
- `.workspace-layout`
- `.note-shell`
- `.feature-grid`
- `.stats-grid`
- `.actions-grid`

## Interactive Elements

### Hover States
- Scale slightly (2-3px down for depth)
- Enhanced glow/shadow
- Border color brightening
- Animated underline on links

### Focus States
- 2px solid green outline with 2px offset
- Text-shadow or box-shadow enhancement

### Active States
- Stronger green border
- Enhanced glow effect
- Gradient background with green undertones

## Scrollbar Styling

- Track: `rgba(20, 45, 35, 0.4)` - Dark forest
- Thumb: Linear gradient from primary to accent with green glow
- Thumb Hover: Brighter gradient with enhanced glow

## Unique Theme Features

✨ **Never Before Seen**: 
- Green nature-inspired color scheme for a notes/productivity app
- Dual glow effect combining emerald and jade tones
- Forest-to-mint transition creating depth
- Organic feel through color psychology
- Modern tech aesthetics with nature harmony
