import NorwayMap from './NorwayMap.jsx';
import { translateMapPoint } from './norwayMapGeometry.js';

const DEFAULT_FRAME = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  width: '100%',
  minHeight: 'clamp(540px, 72vh, 760px)',
  padding: '22px 20px 18px',
  boxSizing: 'border-box',
  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.76) 100%)',
  border: '1px solid #E1E6E5',
  borderRadius: 2,
  boxShadow: '0 14px 32px rgba(31, 31, 35, 0.05)',
};

export default function NorwayCountryBox({
  regionColors = {},
  regionOpacity = {},
  defaultCountyFill = '#E8EEF0',
  outlineFill = '#DDE5E7',
  strokeColor = '#8AAFAD',
  strokeWidth = 0.8,
  markers = [],
  legendItems = [],
  legendVisible = true,
  weatherContent = null,
  mapWidth = 360,
  minHeight,
  frameStyle = {},
  mapStyle = {},
  children,
}) {
  return (
    <div
      style={{
        ...DEFAULT_FRAME,
        ...(minHeight ? { minHeight } : {}),
        ...frameStyle,
      }}
    >
      {weatherContent && (
        <div style={{ position: 'absolute', top: 18, right: 18, zIndex: 2 }}>
          {weatherContent}
        </div>
      )}

      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: weatherContent ? 44 : 6,
          paddingBottom: 8,
        }}
      >
        <NorwayMap
          width={mapWidth}
          regionColors={regionColors}
          regionOpacity={regionOpacity}
          defaultCountyFill={defaultCountyFill}
          outlineFill={outlineFill}
          strokeColor={strokeColor}
          strokeWidth={strokeWidth}
          style={{
            filter: 'drop-shadow(0 6px 12px rgba(31, 31, 35, 0.08))',
            ...mapStyle,
          }}
        >
          {markers.map((marker) => {
            const point = translateMapPoint(marker.cx, marker.cy, marker.countyId);
            const outerRadius = marker.outerRadius ?? 8;
            const innerRadius = marker.innerRadius ?? 4;
            const outerOpacity = marker.outerOpacity ?? 0.22;
            const innerOpacity = marker.innerOpacity ?? 0.92;
            const fill = marker.fill ?? '#2D6A4F';

            return (
              <g key={marker.name}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={outerRadius}
                  fill={fill}
                  opacity={outerOpacity}
                  style={{ transition: 'fill 0.9s ease' }}
                />
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={innerRadius}
                  fill={fill}
                  opacity={innerOpacity}
                  style={{ transition: 'fill 0.9s ease' }}
                />
              </g>
            );
          })}
          {children}
        </NorwayMap>
      </div>

      {!!legendItems.length && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px 28px',
            alignItems: 'center',
            justifyContent: 'flex-start',
            opacity: legendVisible ? 1 : 0,
            transform: `translateY(${legendVisible ? 0 : 8}px)`,
            transition: 'opacity 0.55s ease, transform 0.55s ease',
          }}
        >
          {legendItems.map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: item.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 11, color: '#30373B', whiteSpace: 'nowrap' }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
