import React from "react";

type PointerProps = {
  angle: number;
  center: number;
  radius: number;
  color: string;
};

export const PointerThemes = {
  long: ({ angle, center, radius, color }: PointerProps) => {
    const rad = (Math.PI / 180) * angle;
    return React.createElement("line", {
      x1: center,
      y1: center,
      x2: center + radius * Math.cos(rad),
      y2: center + radius * Math.sin(rad),
      stroke: color,
      strokeWidth: 2
    });
  },
  short: ({ angle, center, radius, color }: PointerProps) => {
    const rad = (Math.PI / 180) * angle;
    const tipR = radius + 2;
    const baseR = radius * 0.82;
    const tipX = center + tipR * Math.cos(rad);
    const tipY = center + tipR * Math.sin(rad);
    const leftX = center + baseR * Math.cos(rad - 0.09);
    const leftY = center + baseR * Math.sin(rad - 0.09);
    const rightX = center + baseR * Math.cos(rad + 0.09);
    const rightY = center + baseR * Math.sin(rad + 0.09);
    return React.createElement("polygon", {
      points: `${tipX},${tipY} ${leftX},${leftY} ${rightX},${rightY}`,
      fill: color
    });
  }
};