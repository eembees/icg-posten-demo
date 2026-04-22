import { COUNTY_PATHS, REGIONS } from './norwayPaths.js';
import { getCountyTranslation } from './norwayMapGeometry.js';

// Real Norway county SVG map
// viewBox: "17 17 598 733" — coordinates from Counties_of_Norway.svg

const REGION_KEYS = Object.keys(REGIONS); // ['ostlandet','vestlandet','trondelag','nord_norge']
const COUNTY_ENTRIES = Object.entries(COUNTY_PATHS).filter(([key]) => key !== '_outline');

function deriveCountyViewBox(padding = 18) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  COUNTY_ENTRIES.forEach(([countyId, paths]) => {
    const offset = getCountyTranslation(countyId);

    paths.forEach((d) => {
      const matches = d.match(/-?\d*\.?\d+/g) || [];
      for (let index = 0; index < matches.length; index += 2) {
        const x = Number(matches[index]) + offset.x;
        const y = Number(matches[index + 1]) + offset.y;

        if (!Number.isFinite(x) || !Number.isFinite(y)) continue;

        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    });
  });

  return {
    x: Math.floor(minX - padding),
    y: Math.floor(minY - padding),
    width: Math.ceil(maxX - minX + padding * 2),
    height: Math.ceil(maxY - minY + padding * 2),
  };
}

const COUNTY_VIEWBOX = deriveCountyViewBox();

/**
 * NorwayMap
 *
 * Props:
 *   width, height       — SVG dimensions (default 160 / auto)
 *   regionColors        — { ostlandet, vestlandet, trondelag, nord_norge } → fill color strings
 *   regionOpacity       — { ostlandet, … } → opacity 0–1 (default 0.7)
 *   defaultCountyFill   — fill for counties not in regionColors (default '#E8EEF0')
 *   outlineFill         — fill for the county-derived country backdrop (default '#DDE5E7')
 *   strokeColor         — county border stroke (default '#8AAFAD')
 *   strokeWidth         — (default 1)
 *   style               — additional style on the <svg>
 *   children            — extra SVG children (dots, labels, etc.)
 */
export default function NorwayMap({
  width = 160,
  height,
  regionColors = {},
  regionOpacity = {},
  defaultCountyFill = '#E8EEF0',
  outlineFill = '#C8D6D4',
  strokeColor = '#7AACAA',
  strokeWidth = 0.8,
  style = {},
  children,
}) {
  const VB_X = COUNTY_VIEWBOX.x;
  const VB_Y = COUNTY_VIEWBOX.y;
  const VB_W = COUNTY_VIEWBOX.width;
  const VB_H = COUNTY_VIEWBOX.height;
  const computedHeight = height ?? Math.round(width * (VB_H / VB_W));

  // Build county → fill map
  const countyFill = {};
  for (const [region, counties] of Object.entries(REGIONS)) {
    const fill = regionColors[region];
    if (fill) {
      for (const county of counties) {
        countyFill[county] = fill;
      }
    }
  }

  return (
    <svg
      viewBox={`${VB_X} ${VB_Y} ${VB_W} ${VB_H}`}
      width={width}
      height={computedHeight}
      preserveAspectRatio="xMidYMid meet"
      shapeRendering="geometricPrecision"
      style={{ overflow: 'visible', display: 'block', isolation: 'isolate', ...style }}
    >
      {/* Country background derived from county geometry so it stays aligned */}
      {COUNTY_ENTRIES.map(([countyId, paths]) => {
        const offset = getCountyTranslation(countyId);
        const transform = offset.x || offset.y ? `translate(${offset.x} ${offset.y})` : undefined;

        return (
          <g key={`outline-${countyId}`} transform={transform}>
            {paths.map((d, pathIndex) => (
              <path
                key={`outline-${countyId}-${pathIndex}`}
                d={d}
                fill={outlineFill}
                stroke="none"
              />
            ))}
          </g>
        );
      })}

      {/* County fills */}
      {COUNTY_ENTRIES.map(([countyId, paths]) => {
        const fill = countyFill[countyId] ?? defaultCountyFill;
        const offset = getCountyTranslation(countyId);
        const transform = offset.x || offset.y ? `translate(${offset.x} ${offset.y})` : undefined;
        // Find which region this county belongs to for opacity
        const region = REGION_KEYS.find(r => REGIONS[r].includes(countyId));
        const opacity = (region && regionOpacity[region] != null) ? regionOpacity[region] : 1;
        return (
          <g key={countyId} transform={transform}>
            {paths.map((d, pi) => (
              <path
                key={`${countyId}-${pi}`}
                d={d}
                fill={fill}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                opacity={opacity}
                vectorEffect="non-scaling-stroke"
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{ transition: 'fill 0.8s ease, opacity 0.8s ease' }}
              />
            ))}
          </g>
        );
      })}

      {children}
    </svg>
  );
}
