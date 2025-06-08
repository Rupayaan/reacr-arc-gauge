import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { ArcGauge } from "./ArcGauge";
import { ArcGaugeThemes } from "./styles/themes";
import { ArcGaugeAnimations } from "./styles/animations";
import { PointerThemes } from "./styles/pointerThemes";

// Example custom pointer
const CustomPointer = ({ angle, center, radius, color }: any) => {
  const rad = (Math.PI / 180) * angle;
  return (
    <rect
      x={center + (radius - 20) * Math.cos(rad) - 4}
      y={center + (radius - 20) * Math.sin(rad) - 4}
      width={8}
      height={8}
      fill={color}
      transform={`rotate(${angle}, ${center + (radius - 20) * Math.cos(rad)}, ${center + (radius - 20) * Math.sin(rad)})`}
    />
  );
};

const themeKeys = Object.keys(ArcGaugeThemes) as Array<keyof typeof ArcGaugeThemes>;
const animationKeys = Object.keys(ArcGaugeAnimations);

const pointerTypes = [
  { label: "Long (default)", value: "long" },
  { label: "Short (triangle)", value: "short" },
  { label: "Custom (square)", value: "custom" }
];

const defaultSegments = [
  { length: 60, color: "#f44336" },
  { length: 60, color: "#ffeb3b" },
  { length: 120, color: "#4caf50" }
];

const Demo: React.FC = () => {
  const [value, setValue] = useState(50);
  const [maxValue, setMaxValue] = useState(240);
  const [themeIndex, setThemeIndex] = useState(0);
  const [animIndex, setAnimIndex] = useState(0);
  const [showNeedle, setShowNeedle] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);
  const [showLabel, setShowLabel] = useState(true);
  const [gaugeType, setGaugeType] = useState<"fill" | "segments">("fill");
  const [segments, setSegments] = useState([...defaultSegments]);
  const [pointerType, setPointerType] = useState<"long" | "short" | "custom">("long");

  // For custom theme/animation
  const [customTheme, setCustomTheme] = useState<any>({});
  const [customAnim, setCustomAnim] = useState<any>({});

  // Segment editing
  const handleSegmentChange = (idx: number, key: "length" | "color", val: any) => {
    setSegments(segs =>
      segs.map((seg, i) =>
        i === idx ? { ...seg, [key]: key === "length" ? Number(val) : val } : seg
      )
    );
  };
  const addSegment = () => {
    setSegments(segs => [
      ...segs,
      { length: Math.max(1, Math.floor(maxValue / 5)), color: "#888" }
    ]);
  };
  const removeSegment = (idx: number) => {
    setSegments(segs => segs.filter((_, i) => i !== idx));
  };

  // Pointer selection
  const pointerComp =
    pointerType === "custom" ? CustomPointer : undefined;

  // Theme/animation selection
  const theme = themeKeys[themeIndex];
  const animation = animationKeys[animIndex];

  // For fill gauge, clamp value to maxValue
  const clampedValue = Math.max(0, Math.min(value, maxValue));

  return (
    <div style={{ padding: 40, textAlign: "center", fontFamily: "sans-serif" }}>
      <h2>Arc Gauge Playground</h2>

      <div style={{ marginBottom: 16 }}>
        <label>
          <b>Gauge Type:</b>{" "}
          <select
            value={gaugeType}
            onChange={e => setGaugeType(e.target.value as any)}
          >
            <option value="fill">Fill</option>
            <option value="segments">Segments</option>
          </select>
        </label>
        {"  "}
        <label style={{ marginLeft: 16 }}>
          <b>Pointer:</b>{" "}
          <select
            value={pointerType}
            onChange={e => setPointerType(e.target.value as any)}
          >
            {pointerTypes.map(pt => (
              <option key={pt.value} value={pt.value}>{pt.label}</option>
            ))}
          </select>
        </label>
        {"  "}
        <label style={{ marginLeft: 16 }}>
          <input
            type="checkbox"
            checked={showNeedle}
            onChange={e => setShowNeedle(e.target.checked)}
          /> Show Needle
        </label>
        {"  "}
        <label style={{ marginLeft: 16 }}>
          <input
            type="checkbox"
            checked={showMarkers}
            onChange={e => setShowMarkers(e.target.checked)}
          /> Show Markers
        </label>
        {"  "}
        <label style={{ marginLeft: 16 }}>
          <input
            type="checkbox"
            checked={showLabel}
            onChange={e => setShowLabel(e.target.checked)}
          /> Show Label
        </label>
      </div>

      {gaugeType === "segments" && (
        <div style={{ margin: "16px 0", border: "1px solid #eee", padding: 12, borderRadius: 8 }}>
          <b>Segments:</b>
          {segments.map((seg, i) => (
            <div key={i} style={{ margin: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <label>
                Length:{" "}
                <input
                  type="number"
                  min={0}
                  max={maxValue}
                  value={seg.length}
                  onChange={e => handleSegmentChange(i, "length", e.target.value)}
                  style={{ width: 60 }}
                />
              </label>
              <label style={{ marginLeft: 8 }}>
                Color:{" "}
                <input
                  type="color"
                  value={seg.color}
                  onChange={e => handleSegmentChange(i, "color", e.target.value)}
                />
              </label>
              <button style={{ marginLeft: 8 }} onClick={() => removeSegment(i)} disabled={segments.length <= 1}>Remove</button>
            </div>
          ))}
          <button style={{ marginTop: 8 }} onClick={addSegment}>Add Segment</button>
          <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
            Total: {segments.reduce((a, b) => a + Number(b.length), 0)} / {maxValue}
            {segments.reduce((a, b) => a + Number(b.length), 0) !== maxValue && (
              <span style={{ color: "red", marginLeft: 8 }}>Segments must sum to maxValue!</span>
            )}
          </div>
        </div>
      )}

      <ArcGauge
        value={clampedValue}
        maxValue={maxValue}
        size={300}
        arcAngle={270}
        thickness={25}
        theme={customTheme && Object.keys(customTheme).length ? customTheme : theme}
        animationStyle={customAnim && Object.keys(customAnim).length ? customAnim : animation}
        animationDuration={800}
        showNeedle={showNeedle}
        showLabel={showLabel}
        rotation={90}
        label={v => `${v} units`}
        gaugeType={gaugeType}
        segments={gaugeType === "segments" ? segments : []}
        showMarkers={showMarkers}
        pointerType={pointerType === "custom" ? undefined : pointerType}
        customPointer={pointerComp}
      />

      <div style={{ marginTop: 20 }}>
        <input
          type="range"
          value={clampedValue}
          onChange={e => setValue(+e.target.value)}
          min={0}
          max={maxValue}
          style={{ width: 300 }}
        />
        <div>Value: {clampedValue}</div>
      </div>

      <div style={{ marginTop: 20 }}>
        <label>
          <b>Theme:</b>{" "}
          <select value={themeIndex} onChange={e => setThemeIndex(Number(e.target.value))}>
            {themeKeys.map((t, i) => (
              <option key={t} value={i}>{t}</option>
            ))}
          </select>
        </label>
        {"  "}
        <label style={{ marginLeft: 16 }}>
          <b>Animation:</b>{" "}
          <select value={animIndex} onChange={e => setAnimIndex(Number(e.target.value))}>
            {animationKeys.map((a, i) => (
              <option key={a} value={i}>{a}</option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ marginTop: 20 }}>
        <label>
          <b>Max Value:</b>{" "}
          <input
            type="number"
            min={1}
            value={maxValue}
            onChange={e => {
              const newMax = Math.max(1, Number(e.target.value));
              setMaxValue(newMax);
              // Adjust segments if needed
              if (gaugeType === "segments") {
                setSegments(segs => {
                  const total = segs.reduce((a, b) => a + Number(b.length), 0);
                  if (total > newMax) {
                    // Scale down
                    return segs.map(s => ({ ...s, length: Math.round((s.length / total) * newMax) }));
                  }
                  return segs;
                });
              }
              if (value > newMax) setValue(newMax);
            }}
            style={{ width: 80 }}
          />
        </label>
      </div>

      <div style={{ marginTop: 20, fontSize: 14 }}>
        <strong>Theme:</strong> {typeof theme === "string" ? theme : "custom"} |{" "}
        <strong>Animation:</strong> {typeof animation === "string" ? animation : "custom"} |{" "}
        <strong>Pointer:</strong> {pointerType}
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<Demo />);
