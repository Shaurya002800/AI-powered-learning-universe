# Green Theme Color Palette Reference 🎨

## Quick Color Reference

```
PRIMARY GREENS
├─ #10d981  ← Emerald (Main CTA, focus, primary elements)
├─ #34d399  ← Jade (Secondary highlights)
├─ #6ee7b7  ← Mint (Tertiary, tags, accent text)
├─ #059669  ← Forest Deep (Hover states)
└─ #10b981  ← Teal (Info, warm accents)

BACKGROUNDS
├─ #0a1410  ← Deep Forest (Body background)
├─ rgba(15,30,25,0.65)   ← Glass surface
├─ rgba(20,45,35,0.8)    ← Strong glass
└─ rgba(10,25,20,0.5)    ← Muted surface

TEXT
├─ #e8f1ed  ← Light Mint (Primary text)
├─ #b4d9c5  ← Soft Mint (Secondary)
└─ #7a9f8f  ← Muted Green (Tertiary)

EFFECTS
├─ rgba(16,217,129,0.15) ← Line color (line variable)
├─ 0 0 20px rgba(16,217,129,0.4) ← Emerald glow
└─ 0 0 20px rgba(52,211,153,0.3) ← Jade glow
```

## CSS Variables

```css
--primary: #10d981
--primary-deep: #059669
--primary-glow: #10d981

--accent: #34d399
--accent-alt: #6ee7b7
--accent-warm: #10b981

--bg: #0a1410
--text: #e8f1ed
--text-secondary: #b4d9c5
--muted: #7a9f8f
```

## Hex to RGBA Conversions

```
#10d981 (emerald green)
├─ rgba(16, 217, 129, 1.0)   ← Full opacity
├─ rgba(16, 217, 129, 0.5)   ← 50%
├─ rgba(16, 217, 129, 0.2)   ← 20%
└─ rgba(16, 217, 129, 0.1)   ← 10%

#34d399 (jade green)
├─ rgba(52, 211, 153, 1.0)   ← Full opacity
├─ rgba(52, 211, 153, 0.5)   ← 50%
└─ rgba(52, 211, 153, 0.2)   ← 20%

#6ee7b7 (mint green)
└─ rgba(110, 231, 183, 0.15) ← 15%
```

## Component Color Usage

### Buttons
```
.button.primary {
  background: linear-gradient(135deg, #10d981 0%, #10b981 100%);
  box-shadow: 0 8px 30px rgba(16, 217, 129, 0.4);
}

.button.secondary {
  color: #10d981;
  border: 1.5px solid #10d981;
  background: rgba(76, 175, 80, 0.1);
}

.button.ghost {
  border: 1px solid rgba(76, 175, 80, 0.2);
  color: #b4d9c5;
}
```

### Glass Effects
```
.glass {
  background: rgba(15, 30, 25, 0.65);
  border: 1px solid rgba(76, 175, 80, 0.15);
  box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 20px rgba(16,217,129,0.4);
}

.glass:hover {
  border-color: rgba(16, 217, 129, 0.3);
  box-shadow: enhanced with glow
}
```

### Cards
```
.card {
  background: linear-gradient(135deg, rgba(20,45,35,0.8) 0%, rgba(15,30,25,0.6) 100%);
  border: 1px solid rgba(76, 175, 80, 0.15);
  box-shadow: inset 0 1px 0 rgba(16, 217, 129, 0.1);
}
```

### Tags
```
.tag {
  background: linear-gradient(135deg, rgba(52,211,153,0.15), rgba(52,211,153,0.05));
  color: #6ee7b7;
  border: 1px solid rgba(52, 211, 153, 0.3);
  box-shadow: 0 0 15px rgba(52, 211, 153, 0.2);
}
```

### Inputs
```
.input:focus {
  border-color: #10d981;
  background: rgba(20, 45, 35, 0.8);
  box-shadow: 0 0 0 4px rgba(16, 217, 129, 0.2), inset 0 0 20px rgba(16, 217, 129, 0.05);
}
```

## Emoji/Icon Theming

Green theme emojis:
- 🌿 Natural, organic
- 🌱 Growth, beginning
- 🌳 Maturity, strength
- 📈 Positive, upward
- 🌾 Harvest, yield

## Animation Colors

```css
/* Glow pulse animation - emerald */
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(16, 217, 129, 0.4); }
  50% { box-shadow: 0 0 40px rgba(16, 217, 129, 0.6); }
}

/* Neon glow animation - emerald + jade */
@keyframes neon-glow {
  0%, 100% { text-shadow: 0 0 10px rgba(16, 217, 129, 0.5); }
  50% { text-shadow: 0 0 20px rgba(16, 217, 129, 0.8), 0 0 30px rgba(52, 211, 153, 0.4); }
}
```

## Accessibility

All text colors meet WCAG AAA standards for contrast:
- Text (#e8f1ed) on Background (#0a1410): ~14.5:1 ✅
- Text (#e8f1ed) on Surface (#0f1e19): ~13.2:1 ✅

## Design Tokens Summary

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|----------|-------|
| --primary | N/A | #10d981 | Main actions, focus |
| --accent | N/A | #34d399 | Secondary highlights |
| --accent-alt | N/A | #6ee7b7 | Tags, tertiary |
| --text | N/A | #e8f1ed | Body text |
| --muted | N/A | #7a9f8f | Disabled, secondary |
| --bg | N/A | #0a1410 | Background |
| --surface | N/A | rgba(15,30,25,0.65) | Containers |

## Transition Values

```css
/* Standard transition */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Fast transitions */
transition: color 0.2s ease, border-color 0.2s ease;

/* Link underline */
transition: width 0.3s ease;
```

## Shadow System

```css
/* Base shadow */
--shadow: 0 20px 60px rgba(0, 0, 0, 0.4);

/* Glow shadow - emerald */
--shadow-lg: 0 40px 120px rgba(16, 217, 129, 0.15);

/* Glow effect */
--glow-cyan: 0 0 20px rgba(16, 217, 129, 0.4);
--glow-magenta: 0 0 20px rgba(52, 211, 153, 0.3);
```

## Notes

- All colors are carefully chosen for modern tech aesthetic with nature harmony
- Opacity values create depth through layering
- Emerald (#10d981) is primary; Jade (#34d399) is complementary
- Green tones avoid looking "earthy" by using bright, saturated hues
- High contrast ensures readability across all text sizes
