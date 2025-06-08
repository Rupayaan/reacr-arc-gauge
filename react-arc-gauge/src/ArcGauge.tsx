import React from "react";
import type { ArcGaugeProps } from "./types";
import { ArcGaugeThemes } from "./styles/themes";
import { ArcGaugeAnimations } from "./styles/animations";
import { PointerThemes } from "./styles/pointerThemes";
import "./arcGauge.css";

type ThemeKey = keyof typeof ArcGaugeThemes;

export const ArcGauge: React.FC<ArcGaugeProps & { theme?: ThemeKey }> = ({
  value,
  maxValue,
  size = 600,
  width,
  height,
  arcAngle = 270,
  thickness = 20,
  rotation = 90,
  startAngle = (360 - arcAngle) / 2,
  theme,
  animationStyle,
  fillColor,
  backgroundColor,
  needleColor,
  showNeedle = false,
  showLabel = true,
  label,
  animationDuration = 500,
  className = "",
  style,
  gaugeType = "fill",
  segments = [],
  showMarkers = false,
  pointerType = "long",
  customPointer,
  markerDisplay = "value",
}) => {
  const t: Partial<(typeof ArcGaugeThemes)[ThemeKey]> = theme && ArcGaugeThemes[theme] ? ArcGaugeThemes[theme] : {};
  const finalFillColor = fillColor ?? t.fillColor ?? "#4caf50";
  const finalBgColor = backgroundColor ?? t.backgroundColor ?? "#ddd";
  const finalNeedleColor = needleColor ?? t.needleColor ?? "#f44336";

  const center = size / 2;
  const radius = center - thickness;
  const clampedValue = Math.min(Math.max(value, 0), maxValue);
  const sweepAngle = arcAngle * (clampedValue / maxValue);

  const polarToCartesian = (angleDeg: number) => {
    const angle = (Math.PI / 180) * angleDeg;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  const describeArc = (angle: number) => {
    const start = polarToCartesian(startAngle);
    const end = polarToCartesian(startAngle + angle);
    const largeArcFlag = angle > 180 ? 1 : 0;

    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y,
    ].join(" ");
  };

  // Helper for segment arcs
  const describeSegmentArc = (startAngle: number, sweep: number) => {
    const start = polarToCartesian(startAngle);
    const end = polarToCartesian(startAngle + sweep);
    const largeArcFlag = sweep > 180 ? 1 : 0;

    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y,
    ].join(" ");
  };

  const animationClass =
    typeof animationStyle === "string" && animationStyle in ArcGaugeAnimations
      ? ArcGaugeAnimations[animationStyle as keyof typeof ArcGaugeAnimations]
      : "";

  // Markers: segment boundaries + min/max, no duplicates
  const markerAngles = (() => {
    if (gaugeType === "segments" && segments.length) {
      let acc = 0;
      const boundaries = [0, ...segments.map(s => (acc += s.length))];
      // Use a Map to deduplicate by value string, ensuring 0 and maxValue are always included
      const angleMap = new Map<number, number>();
      boundaries.forEach(v => {
        // Use toFixed to avoid floating point issues
        const angle = startAngle + (arcAngle * v) / maxValue;
        angleMap.set(Number(angle.toFixed(6)), angle);
      });
      return Array.from(angleMap.values());
    }
    // fallback: min/max
    return [startAngle, startAngle + arcAngle];
  })();

  // Pointer
  const pointerAngle = startAngle + (arcAngle * clampedValue) / maxValue;
  const pointerProps = {
    angle: pointerAngle,
    center,
    radius,
    color: finalNeedleColor,
  };

  const pointerComp =
    typeof customPointer === "function"
      ? customPointer
      : typeof pointerType === "function"
      ? pointerType
      : pointerType === "short"
      ? PointerThemes.short
      : PointerThemes.long;

  // Validation: maxValue must be positive
  if (maxValue <= 0) {
    return <svg width={size} height={size}><text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="14" fill="#888">Invalid maxValue</text></svg>;
  }

  // Validation: segment lengths must sum to maxValue
  if (gaugeType === "segments" && segments.length && segments.reduce((a, b) => a + Number(b.length), 0) !== maxValue) {
    return <svg width={size} height={size}><text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="14" fill="#888">Segments must sum to maxValue</text></svg>;
  }

  // Use width/height if provided, else fallback to size
  const svgWidth = width ?? size;
  const svgHeight = height ?? size;

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${size} ${size}`}
      style={style}
      className={`arc-gauge ${animationClass} ${className}`}
    >
      <g transform={`rotate(${rotation}, ${center}, ${center})`}>
        {gaugeType === "segments" && segments.length > 0 && (
          segments.map((seg, i) => {
            let acc = 0;
            for (let j = 0; j < i; j++) acc += segments[j].length;
            const segStart = startAngle + (arcAngle * acc) / maxValue;
            const segSweep = (arcAngle * seg.length) / maxValue;
            return (
              <path
                key={i}
                d={describeSegmentArc(segStart, segSweep)}
                stroke={seg.color}
                strokeWidth={thickness}
                fill="none"
              />
            );
          })
        )}
        {gaugeType === "fill" && (
          <>
            {/* Background arc */}
            <path
              d={describeArc(arcAngle)}
              stroke={finalBgColor}
              strokeWidth={thickness}
              fill="none"
            />
            {/* Fill arc */}
            <path
              d={describeArc(sweepAngle)}
              stroke={finalFillColor}
              strokeWidth={thickness}
              fill="none"
              style={{ transition: `stroke-dashoffset ${animationDuration}ms` }}
            />
          </>
        )}
        {/* Pointer */}
        {showNeedle && pointerComp && pointerComp(pointerProps)}
        {/* Markers */}
        {markerDisplay !== "none" && showMarkers && markerAngles.map((ang, i) => {
          const rad = (Math.PI / 180) * ang;
          const r = radius + thickness / 2 + 8;
          const valueAtMarker = Math.round(((ang - startAngle) / arcAngle) * maxValue);
          return (
            <g key={i}>
              <circle
                cx={center + r * Math.cos(rad)}
                cy={center + r * Math.sin(rad)}
                r={4}
                fill="#ccc"
                stroke="#fff"
                strokeWidth={2}
              />
              {markerDisplay === "value" && (
                <text
                  x={center + (r + 18) * Math.cos(rad)}
                  y={center + (r + 18) * Math.sin(rad) + 5}
                  textAnchor="middle"
                  fontSize="13"
                  fill="#888"
                >
                  {valueAtMarker}
                </text>
              )}
            </g>
          );
        })}
      </g>
      {/* Label */}
      {showLabel && (
        <text
          x={center}
          y={center + 10}
          textAnchor="middle"
          fontSize="32"
          fill={t.labelColor ?? "#333"}
        >
          {typeof label === "function"
            ? (() => {
                const result = label(value);
                if (result instanceof Promise) {
                  // If label function returns a Promise, fallback to value (or handle as needed)
                  console.warn("ArcGauge label function should not return a Promise.");
                  return `${value}`;
                }
                return React.isValidElement(result) || typeof result === "string" || typeof result === "number"
                  ? result
                  : `${value}`;
              })()
            : label ?? `${value}`}
        </text>
      )}
    </svg>
  );
};
