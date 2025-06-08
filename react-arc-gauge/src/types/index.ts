export interface ArcGaugeSegment {
  length: number; // The value span of this segment
  color: string;  // The color of this segment
}

// PointerType can be a built-in string or a custom React component
export type PointerType =
  | "long"   // Built-in long pointer
  | "short"  // Built-in short pointer (triangle)
  | React.FC<{ angle: number; center: number; radius: number; color: string }>; // Custom pointer

export interface ArcGaugeProps {
  value: number;           // Current value to display on the gauge
  maxValue: number;        // Maximum value of the gauge
  size?: number;           // Size of the gauge (width/height if not set separately)
  width?: number;          // SVG width (overrides size)
  height?: number;         // SVG height (overrides size)
  arcAngle?: number;       // Arc angle in degrees (default: 270)
  thickness?: number;      // Thickness of the arc
  startAngle?: number;     // Starting angle of the arc (degrees)
  rotation?: number;       // Rotation of the entire gauge (degrees)
  fillColor?: string;      // Color of the filled arc
  backgroundColor?: string;// Color of the background arc
  gaugeType?: "fill" | "segments"; // "fill" for a single arc, "segments" for multiple colored segments
  segments?: ArcGaugeSegment[];    // Array of segments (for "segments" gaugeType)
  showMarkers?: boolean;   // Show value markers along the arc
  pointerType?: PointerType; // Pointer style or custom pointer component
  customPointer?: React.FC<any>; // Custom pointer React component
  showNeedle?: boolean;    // Show the pointer/needle
  showLabel?: boolean;     // Show the value label in the center
  label?: ((value: number) => React.ReactNode) | string; // Custom label (function or string)
  animationStyle?: string; // Animation style key
  animationDuration?: number; // Animation duration in ms
  className?: string;      // Additional CSS class for the SVG
  style?: React.CSSProperties; // Inline styles for the SVG
  markerDisplay?: "none" | "dot" | "value"; // Marker display style
}
