# React Arc Gauge

A highly customizable, animated arc gauge component for React.

---

## Features

- Customizable arc angle, thickness, and size
- Supports both "fill" and "segments" gauge types
- Custom pointer styles and themes
- Optional markers and value labels
- Smooth animations

---

## Usage

```tsx
import { ArcGauge } from "react-arc-gauge";

// Fully customized example
<ArcGauge
  value={75}
  maxValue={120}
  size={350}
  arcAngle={240}
  thickness={30}
  gaugeType="segments"
  segments={[
    { length: 30, color: "#f44336" },
    { length: 30, color: "#ffeb3b" },
    { length: 60, color: "#4caf50" }
  ]}
  showMarkers={true}
  markerDisplay="value"
  showNeedle={true}
  pointerType="short"
  showLabel={true}
  label={v => `${v} units`}
  animationStyle="slideUp"
  animationDuration={1000}
/>
```

- **Basic usage:** Just set `value` and `maxValue`.
- **Fully customized:** Control size, arc, thickness, segments, markers, pointer, label, and animation.

---

## Customization

- **Theming:** Use the `theme` prop or override colors directly.
- **Pointers:** Use built-in pointer styles or pass your own React component as a custom pointer via the `customPointer` prop.  
  _To use an SVG file, convert it to a React component (e.g., with [SVGR](https://react-svgr.com/)) and pass it as `customPointer`._
- **Animations:** Choose from built-in animation styles.

---

## Live Demo

👉 [Try the Arc Gauge Demo](https://rupayaan.github.io/reacr-arc-gauge/)

---

## Updates & Roadmap

- **Upcoming:**
  - Built-in SVG-to-pointer converter (use SVG files directly as needles)
  - More built-in themes and pointer shapes
  - Accessibility improvements
  - Export as PNG/SVG
  - Improved mobile support
  - customTheme and animations.


