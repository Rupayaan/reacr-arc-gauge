"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var index_exports = {};
__export(index_exports, {
  ArcGauge: () => ArcGauge
});
module.exports = __toCommonJS(index_exports);

// src/ArcGauge.tsx
var import_react2 = __toESM(require("react"));

// src/styles/themes.ts
var ArcGaugeThemes = {
  oceanBlue: {
    fillColor: "#00bcd4",
    backgroundColor: "#e0f7fa",
    needleColor: "#006064",
    labelColor: "#004d40"
  },
  fireRed: {
    fillColor: "#f44336",
    backgroundColor: "#ffebee",
    needleColor: "#b71c1c",
    labelColor: "#880e4f"
  },
  limeGreen: {
    fillColor: "#8bc34a",
    backgroundColor: "#f1f8e9",
    needleColor: "#33691e",
    labelColor: "#1b5e20"
  }
  // Add more as needed...
};

// src/styles/animations.ts
var ArcGaugeAnimations = {
  fadeIn: "arc-fade-in",
  slideUp: "arc-slide-up",
  bounceFill: "arc-bounce-fill",
  zoomSpin: "arc-zoom-spin",
  pulseNeedle: "arc-pulse-needle"
  // Add more...
};

// src/styles/pointerThemes.ts
var import_react = __toESM(require("react"));
var PointerThemes = {
  long: ({ angle, center, radius, color }) => {
    const rad = Math.PI / 180 * angle;
    return import_react.default.createElement("line", {
      x1: center,
      y1: center,
      x2: center + radius * Math.cos(rad),
      y2: center + radius * Math.sin(rad),
      stroke: color,
      strokeWidth: 2
    });
  },
  short: ({ angle, center, radius, color }) => {
    const rad = Math.PI / 180 * angle;
    const tipR = radius + 2;
    const baseR = radius * 0.82;
    const tipX = center + tipR * Math.cos(rad);
    const tipY = center + tipR * Math.sin(rad);
    const leftX = center + baseR * Math.cos(rad - 0.09);
    const leftY = center + baseR * Math.sin(rad - 0.09);
    const rightX = center + baseR * Math.cos(rad + 0.09);
    const rightY = center + baseR * Math.sin(rad + 0.09);
    return import_react.default.createElement("polygon", {
      points: `${tipX},${tipY} ${leftX},${leftY} ${rightX},${rightY}`,
      fill: color
    });
  }
};

// src/ArcGauge.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var ArcGauge = ({
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
  markerDisplay = "value"
}) => {
  const t = theme && ArcGaugeThemes[theme] ? ArcGaugeThemes[theme] : {};
  const finalFillColor = fillColor ?? t.fillColor ?? "#4caf50";
  const finalBgColor = backgroundColor ?? t.backgroundColor ?? "#ddd";
  const finalNeedleColor = needleColor ?? t.needleColor ?? "#f44336";
  const center = size / 2;
  const radius = center - thickness;
  const clampedValue = Math.min(Math.max(value, 0), maxValue);
  const sweepAngle = arcAngle * (clampedValue / maxValue);
  const polarToCartesian = (angleDeg) => {
    const angle = Math.PI / 180 * angleDeg;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle)
    };
  };
  const describeArc = (angle) => {
    const start = polarToCartesian(startAngle);
    const end = polarToCartesian(startAngle + angle);
    const largeArcFlag = angle > 180 ? 1 : 0;
    return [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      1,
      end.x,
      end.y
    ].join(" ");
  };
  const describeSegmentArc = (startAngle2, sweep) => {
    const start = polarToCartesian(startAngle2);
    const end = polarToCartesian(startAngle2 + sweep);
    const largeArcFlag = sweep > 180 ? 1 : 0;
    return [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      1,
      end.x,
      end.y
    ].join(" ");
  };
  const animationClass = typeof animationStyle === "string" && animationStyle in ArcGaugeAnimations ? ArcGaugeAnimations[animationStyle] : "";
  const markerAngles = (() => {
    if (gaugeType === "segments" && segments.length) {
      let acc = 0;
      const boundaries = [0, ...segments.map((s) => acc += s.length)];
      const angleMap = /* @__PURE__ */ new Map();
      boundaries.forEach((v) => {
        const angle = startAngle + arcAngle * v / maxValue;
        angleMap.set(Number(angle.toFixed(6)), angle);
      });
      return Array.from(angleMap.values());
    }
    return [startAngle, startAngle + arcAngle];
  })();
  const pointerAngle = startAngle + arcAngle * clampedValue / maxValue;
  const pointerProps = {
    angle: pointerAngle,
    center,
    radius,
    color: finalNeedleColor
  };
  const pointerComp = typeof customPointer === "function" ? customPointer : typeof pointerType === "function" ? pointerType : pointerType === "short" ? PointerThemes.short : PointerThemes.long;
  if (maxValue <= 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: size, height: size, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", { x: "50%", y: "50%", textAnchor: "middle", dy: ".3em", fontSize: "14", fill: "#888", children: "Invalid maxValue" }) });
  }
  if (gaugeType === "segments" && segments.length && segments.reduce((a, b) => a + Number(b.length), 0) !== maxValue) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { width: size, height: size, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", { x: "50%", y: "50%", textAnchor: "middle", dy: ".3em", fontSize: "14", fill: "#888", children: "Segments must sum to maxValue" }) });
  }
  const svgWidth = width ?? size;
  const svgHeight = height ?? size;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "svg",
    {
      width: svgWidth,
      height: svgHeight,
      viewBox: `0 0 ${size} ${size}`,
      style,
      className: `arc-gauge ${animationClass} ${className}`,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { transform: `rotate(${rotation}, ${center}, ${center})`, children: [
          gaugeType === "segments" && segments.length > 0 && segments.map((seg, i) => {
            let acc = 0;
            for (let j = 0; j < i; j++) acc += segments[j].length;
            const segStart = startAngle + arcAngle * acc / maxValue;
            const segSweep = arcAngle * seg.length / maxValue;
            return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "path",
              {
                d: describeSegmentArc(segStart, segSweep),
                stroke: seg.color,
                strokeWidth: thickness,
                fill: "none"
              },
              i
            );
          }),
          gaugeType === "fill" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "path",
              {
                d: describeArc(arcAngle),
                stroke: finalBgColor,
                strokeWidth: thickness,
                fill: "none"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "path",
              {
                d: describeArc(sweepAngle),
                stroke: finalFillColor,
                strokeWidth: thickness,
                fill: "none",
                style: { transition: `stroke-dashoffset ${animationDuration}ms` }
              }
            )
          ] }),
          showNeedle && pointerComp && pointerComp(pointerProps),
          markerDisplay !== "none" && showMarkers && markerAngles.map((ang, i) => {
            const rad = Math.PI / 180 * ang;
            const r = radius + thickness / 2 + 8;
            const valueAtMarker = Math.round((ang - startAngle) / arcAngle * maxValue);
            return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "circle",
                {
                  cx: center + r * Math.cos(rad),
                  cy: center + r * Math.sin(rad),
                  r: 4,
                  fill: "#ccc",
                  stroke: "#fff",
                  strokeWidth: 2
                }
              ),
              markerDisplay === "value" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "text",
                {
                  x: center + (r + 18) * Math.cos(rad),
                  y: center + (r + 18) * Math.sin(rad) + 5,
                  textAnchor: "middle",
                  fontSize: "13",
                  fill: "#888",
                  children: valueAtMarker
                }
              )
            ] }, i);
          })
        ] }),
        showLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "text",
          {
            x: center,
            y: center + 10,
            textAnchor: "middle",
            fontSize: "32",
            fill: t.labelColor ?? "#333",
            children: typeof label === "function" ? (() => {
              const result = label(value);
              if (result instanceof Promise) {
                console.warn("ArcGauge label function should not return a Promise.");
                return `${value}`;
              }
              return import_react2.default.isValidElement(result) || typeof result === "string" || typeof result === "number" ? result : `${value}`;
            })() : label ?? `${value}`
          }
        )
      ]
    }
  );
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ArcGauge
});
