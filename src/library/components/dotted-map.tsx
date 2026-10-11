"use client";
import * as React from "react";
import { useReducedMotion } from "motion/react";
import { createMap } from "svg-dotted-map";

import { cn } from "../../class-names";

export interface Marker {
  lat: number;
  lng: number;
  size?: number;
  pulse?: boolean;
}

/** addMarkers returns markers with lat/lng removed; only x, y and other props (e.g. size) remain */
type MapMarker<M extends Marker> = Omit<M, "lat" | "lng"> & {
  x: number;
  y: number;
};

export interface DottedMapProps<
  M extends Marker = Marker,
> extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  mapSamples?: number;
  markers?: M[];
  dotColor?: string;
  markerColor?: string;
  dotRadius?: number;
  stagger?: boolean;
  pulse?: boolean;

  renderMarkerOverlay?: (args: {
    marker: MapMarker<M>;
    index: number;
    x: number;
    y: number;
    r: number;
  }) => React.ReactNode;
}

export function DottedMap<M extends Marker = Marker>({
  width = 150,
  height = 75,
  mapSamples = 5000,
  markers = [],
  dotColor = "currentColor",
  markerColor = "#FF6900",
  dotRadius = 0.2,
  stagger = true,
  pulse = false,
  renderMarkerOverlay,
  className,
  style,
  ...svgProps
}: DottedMapProps<M>) {
  const reduced = useReducedMotion();
  const { points, addMarkers } = React.useMemo(
    () => createMap({ width, height, mapSamples }),
    [width, height, mapSamples],
  );
  const processedMarkers = addMarkers(markers);

  // Compute stagger helpers in a single, simple pass
  const { xStep, yToRowIndex } = React.useMemo(() => {
    const sorted = [...points].sort((a, b) => a.y - b.y || a.x - b.x);
    const rowMap = new Map<number, number>();
    let step = 0;
    let prevY = Number.NaN;
    let prevXInRow = Number.NaN;

    for (const p of sorted) {
      if (p.y !== prevY) {
        // new row
        prevY = p.y;
        prevXInRow = Number.NaN;
        if (!rowMap.has(p.y)) rowMap.set(p.y, rowMap.size);
      }
      if (!Number.isNaN(prevXInRow)) {
        const delta = p.x - prevXInRow;
        if (delta > 0) step = step === 0 ? delta : Math.min(step, delta);
      }
      prevXInRow = p.x;
    }

    return { xStep: step || 1, yToRowIndex: rowMap };
  }, [points]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("text-gray-500 dark:text-gray-500", className)}
      style={{ width: "100%", height: "100%", ...style }}
      {...svgProps}
    >
      {points.map((point, index) => {
        const rowIndex = yToRowIndex.get(point.y) ?? 0;
        const offsetX = stagger && rowIndex % 2 === 1 ? xStep / 2 : 0;
        return (
          <circle
            cx={point.x + offsetX}
            cy={point.y}
            r={dotRadius}
            fill={dotColor}
            key={`${point.x}-${point.y}-${index}`}
          />
        );
      })}

      {processedMarkers.map((marker, index) => {
        const rowIndex = yToRowIndex.get(marker.y) ?? 0;
        const offsetX = stagger && rowIndex % 2 === 1 ? xStep / 2 : 0;

        const x = marker.x + offsetX;
        const y = marker.y;
        const r = marker.size ?? dotRadius;
        const shouldPulse =
          !reduced && (pulse ? marker.pulse !== false : marker.pulse === true);
        const pulseTo = r * 2.8;

        return (
          <g key={`${marker.x}-${marker.y}-${index}`}>
            <circle cx={x} cy={y} r={r} fill={markerColor} />

            {shouldPulse ? (
              <g pointerEvents="none">
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill="none"
                  stroke={markerColor}
                  strokeOpacity={1}
                  strokeWidth={0.35}
                >
                  <animate
                    attributeName="r"
                    values={`${r};${pulseTo}`}
                    dur="1.4s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="1;0"
                    dur="1.4s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill="none"
                  stroke={markerColor}
                  strokeOpacity={0.9}
                  strokeWidth={0.3}
                >
                  <animate
                    attributeName="r"
                    values={`${r};${pulseTo}`}
                    dur="1.4s"
                    begin="0.7s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.9;0"
                    dur="1.4s"
                    begin="0.7s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            ) : null}

            {renderMarkerOverlay?.({
              marker: { ...marker, x, y },
              index,
              x,
              y,
              r,
            })}
          </g>
        );
      })}
    </svg>
  );
}

export type DottedMapDemoProps = Partial<DottedMapProps>;
const DEMO_MARKERS: Marker[] = [
  { lat: 34.6937, lng: 135.5022, size: 0.65 },
  { lat: 40.7128, lng: -74.006, size: 0.65 },
  { lat: 41.0082, lng: 28.9784, size: 0.65 },
];
export default function DottedMapDemo({
  className,
  ...props
}: DottedMapDemoProps) {
  const [pulse, setPulse] = React.useState(false);
  const [markers, setMarkers] = React.useState(true);
  return (
    <div
      className={cn("dui-dotted-map", className)}
      data-component-layout="motion"
    >
      <div className={cn("h-[180px] w-full max-w-sm")}>
        <DottedMap
          {...props}
          mapSamples={props.mapSamples ?? 3200}
          markers={props.markers ?? (markers ? DEMO_MARKERS : [])}
          pulse={props.pulse ?? pulse}
          markerColor={props.markerColor ?? "#3355c5"}
          dotColor={props.dotColor ?? "#3b4252"}
          dotRadius={props.dotRadius ?? 0.38}
          className={cn("text-[#3b4252]")}
          role="img"
          aria-label="Dotted world map with example locations"
        />
      </div>
      <div className={cn("dui-demo-controls")}>
        <button
          type="button"
          aria-pressed={pulse}
          onClick={() => setPulse((v) => !v)}
        >
          Pulse markers
        </button>
        <button
          type="button"
          aria-pressed={markers}
          onClick={() => setMarkers((v) => !v)}
        >
          Show markers
        </button>
      </div>
    </div>
  );
}
