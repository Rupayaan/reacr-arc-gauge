export interface ArcGaugeSegment {
  length: number; // value, not degrees
  color: string;
}

export type PointerType = "long" | "short" | React.FC<{ angle: number, center: number, radius: number, color: string }>;

export interface ArcGaugeProps {
  value: number;
  maxValue: number;
  size?: number;
  arcAngle?: number;
  thickness?: number;
  startAngle?: number;
  rotation?: number;

  fillColor?: string;
  backgroundColor?: string;

  gaugeType?: "fill" | "segments";
  segments?: ArcGaugeSegment[];

  showMarkers?: boolean;
markerDisplay?: "none" | "dot" | "value";
  showNeedle?: boolean;
  pointerType?: PointerType;
  customPointer?: React.FC<{ angle: number, center: number, radius: number, color: string }>;
  needleColor?: string;
 
  showLabel?: boolean;
  label?: string | ((value: number) => React.ReactNode);

  animationStyle?: string | object;
  theme?: string | object;
  animationDuration?: number;

  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
}
