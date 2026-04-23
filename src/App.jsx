import { useState, useEffect, useRef, useEffectEvent } from "react";
import NorwayCountryBox from "./NorwayCountryBox.jsx";

// ─── DESIGN TOKENS (Implement Consulting Group) ───────────────────────────────
const C = {
  blueGreen: '#67817F',
  greenGrey: '#B9C7C2',
  black: '#1F1F23',
  ash: '#30373B',
  grey: '#A8A5A1',
  egg: '#F8F5E7',
  lightGrey: '#F2F2F1',
  white: '#FFFFFF',
  border: '#E1E6E5',
  bgNear: '#F1F4F3',
  bgLight: '#E1E6E5',
  // Status
  sGreen: '#2D6A4F', sGreenBg: '#D8F3DC',
  sAmber: '#92580A', sAmberBg: '#FFF0CC',
  sRed: '#8B1A1A',   sRedBg: '#FDECEA',
  sLocked: '#A8A5A1', sLockedBg: '#F2F2F1',
};
const FD = "'Palatino Linotype', Palatino, Georgia, serif";
const FB = "Arial, Helvetica, sans-serif";

const fade = (phase, target, delay = 0) => ({
  opacity: phase >= target ? 1 : 0,
  transform: `translateY(${phase >= target ? 0 : 10}px)`,
  transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
  pointerEvents: phase >= target ? 'auto' : 'none',
});

const SURFACE_SHADOW = '0 14px 32px rgba(31, 31, 35, 0.05)';
const SURFACE_CARD = {
  background: C.white,
  border: `1px solid ${C.border}`,
  borderRadius: 2,
  boxShadow: SURFACE_SHADOW,
};
const MAP_FRAME = {
  ...SURFACE_CARD,
  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.72) 100%)',
  padding: '16px 14px 18px',
};
const MAP_NEUTRAL_FILL = '#E6ECEA';
const MAP_OUTLINE_FILL = '#D7E0DE';
const MAP_STROKE = '#6A8684';

// ─── STAGE DATA ───────────────────────────────────────────────────────────────
const STAGES = [
  {
    id: 'discover', num: '01', label: 'DISCOVER', title: 'Impact Case',
    gateStatus: 'green', gateLabel: '✓ GATE PASSED', maxPhase: 4,
    gateChecks: [
      { s: 'green', text: 'Value hypothesis: NOK 40M annual impact quantified' },
      { s: 'green', text: 'Business owner: Kari Andersen, VP Operations' },
      { s: 'green', text: 'KPI baseline: on-time delivery 71% during weather events' },
      { s: 'green', text: 'Half Double sprint: 8-week impact sprint confirmed' },
    ],
  },
  {
    id: 'design', num: '02', label: 'DESIGN', title: 'Outcome-Centric Solution',
    gateStatus: 'amber', gateLabel: '⚠ GATE IN REVIEW', maxPhase: 3,
    gateChecks: [
      { s: 'green', text: 'AI rerouting scoped to MVP — 3 core rerouting heuristics' },
      { s: 'green', text: 'User journey mapped for dispatchers & route planners' },
      { s: 'amber', text: 'Experiment backlog: 3 of 4 sprint experiments approved' },
      { s: 'amber', text: 'TMS API access request submitted — ETA 3 days' },
    ],
  },
  {
    id: 'detail', num: '03', label: 'DETAIL', title: 'Defences & Integration Plan',
    gateStatus: 'amber', gateLabel: '⚠ PROCEED WITH 3/4', maxPhase: 4,
    gateChecks: [
      { s: 'green', text: 'TMS connector: schema validated, integration live' },
      { s: 'green', text: 'YR.NO weather API: public access confirmed' },
      { s: 'amber', text: 'Route Optimizer: minor field mapping required (2 days)' },
      { s: 'red',   text: 'Fleet GPS: latency 8–14s — infeasible, escalate to human' },
    ],
  },
  {
    id: 'decision', num: '04', label: 'DECISION', title: 'Go / No-Go Gate',
    gateStatus: 'green', gateLabel: '✓ DECISION: GO', maxPhase: 4,
    gateChecks: [
      { s: 'green', text: 'Demo accuracy: 91% correct rerouting on 600-parcel test set' },
      { s: 'green', text: 'HITL workflow validated with 3 dispatchers across 2 depots' },
      { s: 'green', text: 'GDPR compliance confirmed — no PII in routing model inputs' },
      { s: 'green', text: 'Steering committee sign-off: 15 Apr 2025' },
    ],
  },
  {
    id: 'delivery', num: '05', label: 'DELIVERY', title: 'Phased Regional Rollout',
    gateStatus: 'amber', gateLabel: '⚠ ROLLOUT ACTIVE', maxPhase: 5,
    gateChecks: [
      { s: 'green',  text: 'Østlandet pilot: live · on-time delivery 87% (+16pp)' },
      { s: 'green',  text: 'Vestlandet: deployed · customer NPS +9 points' },
      { s: 'amber',  text: 'Trøndelag: week 3 of 4 · dispatcher training 60%' },
      { s: 'locked', text: 'Nord-Norge: deployment planned week 6' },
    ],
  },
  {
    id: 'deploy', num: '06', label: 'DEPLOYMENT', title: 'Adoption & Realisation',
    gateStatus: 'green', gateLabel: '✓ FULLY DEPLOYED', maxPhase: 3,
    gateChecks: [
      { s: 'green', text: '200 dispatchers trained · certification rate 94%' },
      { s: 'green', text: 'CoE established · 4 AI stewards appointed' },
      { s: 'green', text: 'HITL protocols embedded in daily operations' },
      { s: 'green', text: '90-day KPI review: on-time delivery 88% ✓ TARGET HIT' },
    ],
  },
];

// ─── SMALL HELPERS ────────────────────────────────────────────────────────────

function StatusBadge({ s, label }) {
  const map = {
    green:  [C.sGreen, C.sGreenBg],
    amber:  [C.sAmber, C.sAmberBg],
    red:    [C.sRed,   C.sRedBg],
    locked: [C.sLocked, C.sLockedBg],
  };
  const [col, bg] = map[s] || map.locked;
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 2,
      fontSize: 11, fontFamily: FB, fontWeight: 700, letterSpacing: '0.04em',
      color: col, background: bg, border: `1px solid ${col}30`,
    }}>{label}</span>
  );
}

function CheckRow({ s, text, visible }) {
  const icon = s === 'green' ? '✓' : s === 'amber' ? '⚠' : s === 'red' ? '✗' : '○';
  const col  = s === 'green' ? C.sGreen : s === 'amber' ? C.sAmber : s === 'red' ? C.sRed : C.grey;
  return (
    <div style={{
      display: 'flex', gap: 8, alignItems: 'flex-start',
      opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(6px)',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
      padding: '5px 0', borderBottom: `1px solid ${C.border}`,
    }}>
      <span style={{ color: col, fontFamily: FB, fontSize: 13, fontWeight: 700, minWidth: 14 }}>{icon}</span>
      <span style={{ fontFamily: FB, fontSize: 12, color: C.ash, lineHeight: 1.5 }}>{text}</span>
    </div>
  );
}

function FlowDivider({ active, color = C.blueGreen, compact = false }) {
  const size = compact ? 6 : 10;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: compact ? 0 : 3,
      padding: compact ? '0 0' : '6px 0',
      opacity: active ? 1 : 0.28,
      transition: 'opacity 0.35s ease',
    }}>
      {[0, 1].map((step) => (
        <span
          key={step}
          style={{
            width: 0,
            height: 0,
            borderLeft: `${size}px solid transparent`,
            borderRight: `${size}px solid transparent`,
            borderTop: `${size + 4}px solid ${color}`,
            filter: active ? `drop-shadow(0 2px 4px ${color}22)` : 'none',
            animation: active ? `flowChevron 1.1s ease-in-out ${step * 0.18}s infinite` : 'none',
          }}
        />
      ))}
    </div>
  );
}

// ─── CITY COORDINATES in real SVG space (viewBox 17 17 598 733) ──────────────
// Positions derived from county centroids in Counties_of_Norway.svg
const CITIES = [
  { cx: 137, cy: 465, name: 'Oslo',         region: 'ostlandet',  countyId: 'Oslo' },
  { cx: 109, cy: 450, name: 'Drammen',      region: 'ostlandet',  countyId: 'Buskerud' },
  { cx:  72, cy: 512, name: 'Kristiansand', region: 'ostlandet',  countyId: 'Vest_Agder' },
  { cx: 158, cy: 670, name: 'Bergen',       region: 'vestlandet', countyId: 'Hordaland' },
  { cx: 142, cy: 718, name: 'Stavanger',    region: 'vestlandet', countyId: 'Rogaland' },
  { cx: 200, cy: 573, name: 'Ålesund',      region: 'vestlandet', countyId: 'More_og_Romsdal' },
  { cx: 260, cy: 555, name: 'Trondheim',    region: 'trondelag',  countyId: 'Sor_Trondelag' },
  { cx: 345, cy: 395, name: 'Bodø',         region: 'nord_norge', countyId: 'Nordland' },
  { cx: 440, cy: 322, name: 'Tromsø',       region: 'nord_norge', countyId: 'Troms' },
];

// ─── SCENE 1: DISCOVERY ───────────────────────────────────────────────────────
function SceneDiscover({ phase }) {
  const dotColor = (city) => {
    if (phase < 2) return C.sGreen;
    const redCities   = ['Bergen', 'Stavanger', 'Oslo'];
    const amberCities = ['Drammen', 'Trondheim', 'Ålesund', 'Kristiansand'];
    if (phase >= 3 && redCities.includes(city.name))   return C.sRed;
    if (phase >= 2 && amberCities.includes(city.name)) return C.sAmber;
    if (phase >= 2 && redCities.includes(city.name))   return C.sAmber;
    return C.sGreen;
  };

  // County fill by region based on phase
  const regionColors = {};
  if (phase >= 3) {
    regionColors.vestlandet = C.sRed + '55';
    regionColors.ostlandet  = C.sAmber + '44';
  } else if (phase >= 2) {
    regionColors.vestlandet = C.sAmber + '44';
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(340px, 420px) minmax(260px, 1fr)',
      gap: 18,
      height: '100%',
      alignItems: 'flex-start',
      paddingTop: 4,
    }}>
      {/* Map column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
        <NorwayCountryBox
          regionColors={regionColors}
          defaultCountyFill={MAP_NEUTRAL_FILL}
          outlineFill={MAP_OUTLINE_FILL}
          strokeColor={MAP_STROKE}
          strokeWidth={0.8}
          mapWidth={340}
          minHeight="clamp(460px, 63vh, 620px)"
          frameStyle={{ ...MAP_FRAME, padding: '14px 12px 14px', ...fade(phase, 0) }}
          weatherContent={(
            <div style={{ ...fade(phase, 1), textAlign: 'right' }}>
              <div style={{ fontSize: 30, lineHeight: 1 }}>{phase < 2 ? '☀️' : '⛈️'}</div>
              <div style={{ fontFamily: FB, fontSize: 11, color: C.grey, marginTop: 4, whiteSpace: 'nowrap' }}>
                {phase < 2 ? 'Normal conditions' : 'Storm · Vestlandet'}
              </div>
            </div>
          )}
          markers={CITIES.map((city) => ({
            ...city,
            fill: dotColor(city),
          }))}
          legendVisible={phase >= 2}
          legendItems={[
            { label: 'On time', color: C.sGreen },
            { label: 'At risk', color: C.sAmber },
            { label: 'Delayed', color: C.sRed },
          ]}
        />
      </div>

      {/* Stats + insight */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8, maxWidth: 560 }}>
        {[
          { label: 'Parcels in-flight', val: '2,418', col: C.black, p: 1 },
          { label: 'At risk (amber)',    val: '847',   col: C.sAmber, p: 2 },
          { label: 'Delayed (red)',      val: '312',   col: C.sRed,   p: 3 },
        ].map(s => (
          <div key={s.label} style={{
            ...SURFACE_CARD,
            padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            ...fade(phase, s.p, (s.p - 1) * 120),
          }}>
            <span style={{ fontFamily: FB, fontSize: 12, color: C.ash }}>{s.label}</span>
            <span style={{ fontFamily: FD, fontSize: 22, color: s.col }}>{s.val}</span>
          </div>
        ))}

        {/* Value hypothesis */}
        <div style={{
          background: C.blueGreen, borderRadius: 2, padding: '14px 16px',
          ...fade(phase, 4, 200),
        }}>
          <div style={{ fontFamily: FD, fontSize: 13, color: C.white, fontStyle: 'italic', lineHeight: 1.55 }}>
            "Dynamic rerouting recovers 73% of at-risk parcels within SLA windows"
          </div>
          <div style={{ fontFamily: FB, fontSize: 11, color: C.greenGrey, marginTop: 6 }}>
            Source: 18-month disruption analysis · Posten Bring Data Science
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SCENE 2: DATA PLATFORM ───────────────────────────────────────────────────
const DATA_DOMAINS = [
  {
    name: 'TMS', full: 'Transport Management System', type: 'Internal',
    steward: 'Lars Hagen, Data Steward', count: '2.4M parcels',
    quality: 92, qualityLabel: 'Quality score: 92/100',
    color: C.sGreen, colorBg: C.sGreenBg,
    rows: [
      { id: 'POST-24018', route: 'Oslo → Bergen', status: 'In transit' },
      { id: 'POST-24019', route: 'Stavanger → Trondheim', status: 'At risk' },
      { id: 'POST-24020', route: 'Bergen → Ålesund', status: 'Delayed' },
    ],
    checks: ['✓ Real-time feed (< 30s lag)', '✓ Parcel ID schema stable', '✓ Route geometry included'],
  },
  {
    name: 'Route Optimizer', full: 'Internal Route Planning System', type: 'Internal',
    steward: 'Ingrid Moe, Lead Engineer', count: '18,400 routes',
    quality: 78, qualityLabel: 'Quality score: 78/100',
    color: C.sAmber, colorBg: C.sAmberBg,
    rows: [
      { id: 'RTE-00441', route: 'Driver: Bjørn A · 14 stops', status: '⚠ Partial' },
      { id: 'RTE-00442', route: 'Driver: Silje R · 22 stops', status: '⚠ Partial' },
      { id: 'RTE-00443', route: 'Driver: Erik N · 9 stops',  status: '✓ Full' },
    ],
    checks: ['✓ Route IDs linkable to TMS', '⚠ 2 fields need mapping', '⚠ API rate limit: 500 req/min'],
  },
  {
    name: 'YR.NO / MET Norway', full: 'National Weather Service', type: 'Public API',
    steward: 'Public — SLA 99.5%', count: '84 active alerts',
    quality: 97, qualityLabel: 'Quality score: 97/100',
    color: C.sGreen, colorBg: C.sGreenBg,
    rows: [
      { id: 'WRN-001', route: 'Storm warning · Vestland', status: 'SEVERE' },
      { id: 'WRN-002', route: 'Heavy snow · E6 Dovrefjell', status: 'HIGH' },
      { id: 'WRN-003', route: 'Ice · Trøndelag', status: 'MODERATE' },
    ],
    checks: ['✓ Free public API, no auth', '✓ County + road-level granularity', '✓ 6hr forecast windows'],
  },
];

function SceneDataPlatform({ phase }) {
  return (
    <div style={{ display: 'flex', gap: 14, height: '100%', alignItems: 'flex-start', paddingTop: 0 }}>
      {DATA_DOMAINS.map((d, i) => (
        <div key={d.name} style={{
          flex: 1, background: C.white, border: `1px solid ${C.border}`, borderRadius: 2,
          overflow: 'hidden', ...fade(phase, i + 1, i * 150),
        }}>
          {/* Header */}
          <div style={{ background: d.colorBg, padding: '10px 14px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, color: d.color, letterSpacing: '0.05em' }}>{d.type}</div>
            <div style={{ fontFamily: FB, fontSize: 13, fontWeight: 700, color: C.black, marginTop: 2 }}>{d.name}</div>
            <div style={{ fontFamily: FB, fontSize: 11, color: C.ash, marginTop: 1 }}>{d.full}</div>
          </div>

          {/* Steward + count */}
          <div style={{ padding: '8px 14px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontFamily: FB, fontSize: 11, color: C.grey }}>DATA STEWARD</div>
            <div style={{ fontFamily: FB, fontSize: 12, color: C.ash, fontWeight: 700, marginTop: 1 }}>{d.steward}</div>
            <div style={{ fontFamily: FD, fontSize: 16, color: C.blueGreen, marginTop: 6 }}>{d.count}</div>
          </div>

          {/* Sample rows */}
          <div style={{ padding: '8px 14px', borderBottom: `1px solid ${C.border}` }}>
            {d.rows.map((r, ri) => (
              <div key={ri} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '4px 0', borderBottom: ri < d.rows.length - 1 ? `1px solid ${C.border}` : 'none',
              }}>
                <div>
                  <div style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, color: C.black }}>{r.id}</div>
                  <div style={{ fontFamily: FB, fontSize: 10, color: C.grey }}>{r.route}</div>
                </div>
                <div style={{ fontFamily: FB, fontSize: 10, color: C.ash }}>{r.status}</div>
              </div>
            ))}
          </div>

          {/* Quality score + checklist */}
          <div style={{
            padding: '8px 14px',
            opacity: phase >= 4 ? 1 : 0,
            transition: 'opacity 0.5s ease 200ms',
          }}>
            <div style={{ fontFamily: FB, fontSize: 11, color: C.grey, marginBottom: 4 }}>{d.qualityLabel}</div>
            <div style={{
              height: 6, background: C.border, borderRadius: 3, overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', width: `${d.quality}%`, background: d.color,
                transition: 'width 1s ease 400ms', borderRadius: 3,
              }} />
            </div>
            <div style={{ marginTop: 8 }}>
              {d.checks.map((c, ci) => (
                <div key={ci} style={{ fontFamily: FB, fontSize: 10, color: C.ash, padding: '1px 0' }}>{c}</div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── SCENE 3: INTEGRATION CHECKS ─────────────────────────────────────────────
const INTEGRATIONS = [
  {
    name: 'TMS',
    type: 'Internal API',
    status: 'green',
    badge: 'READY',
    note: 'No critical vulnerability. Parcel and route IDs are stable.',
  },
  {
    name: 'Route Optimizer',
    type: 'Internal API',
    status: 'amber',
    badge: 'FIX NEEDED',
    note: 'Vulnerability: 2 route fields need mapping before orchestration.',
  },
  {
    name: 'YR.NO / MET',
    type: 'Public REST API',
    status: 'green',
    badge: 'READY',
    note: 'No critical vulnerability. Add caching for weather outage tolerance.',
  },
  {
    name: 'Fleet GPS',
    type: 'IoT Stream',
    status: 'red',
    badge: 'BLOCKED',
    note: 'Vulnerability: 8–14s latency is too high for automated rerouting.',
  },
];

function SceneIntegration({ phase }) {
  const statusColor = s => s === 'green' ? C.sGreen : s === 'amber' ? C.sAmber : C.sRed;
  const statusBg    = s => s === 'green' ? C.sGreenBg : s === 'amber' ? C.sAmberBg : C.sRedBg;
  const boardWidth = 560;
  const boardHeight = 444;
  const boxWidth = 118;
  const boxHeight = 118;
  const noteHeight = 116;
  const topY = 26;
  const noteY = topY + boxHeight + 14;
  const gap = 18;
  const xStart = 17;
  const serviceX = INTEGRATIONS.map((_, i) => xStart + i * (boxWidth + gap));
  const engineWidth = 198;
  const engineHeight = 90;
  const engineLeft = (boardWidth - engineWidth) / 2;
  const engineTop = 334;
  const engineCenterX = boardWidth / 2;
  const engineTopY = engineTop + 6;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', paddingTop: 8, ...fade(phase, 0) }}>
      <div style={{
        ...SURFACE_CARD,
        position: 'relative',
        width: boardWidth,
        height: boardHeight,
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 250, 249, 0.9) 100%)',
        overflow: 'hidden',
      }}>
        <svg style={{ position: 'absolute', inset: 0 }} width={boardWidth} height={boardHeight}>
          <defs>
            <marker id="flowArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={C.blueGreen} />
            </marker>
          </defs>

          <line x1="40" y1="18" x2={boardWidth - 40} y2="18" stroke={C.border} strokeWidth="1" />

          {INTEGRATIONS.map((ig, i) => {
            const startX = serviceX[i] + boxWidth / 2;
            const startY = topY + boxHeight + 3;
            const col = phase >= 2 ? statusColor(ig.status) : C.greenGrey;
            const path = `M ${startX} ${startY} C ${startX} ${startY + 58}, ${engineCenterX} ${engineTopY - 72}, ${engineCenterX} ${engineTopY}`;

            return (
              <path
                key={ig.name}
                d={path}
                fill="none"
                stroke={col}
                strokeWidth="2.6"
                strokeDasharray="8 10"
                markerEnd="url(#flowArrow)"
                opacity={phase >= 2 ? 0.95 : 0}
                style={{
                  transition: `opacity 0.45s ease ${i * 90 + 120}ms`,
                  animation: phase >= 2 ? `flowDash 1s linear ${i * 0.08}s infinite` : 'none',
                }}
              />
            );
          })}
        </svg>

        <div style={{
          position: 'absolute',
          left: engineLeft,
          top: engineTop,
          width: engineWidth,
          height: engineHeight,
          background: C.blueGreen,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 2,
          boxShadow: SURFACE_SHADOW,
          ...fade(phase, 2, 120),
        }}>
          <div style={{ fontFamily: FB, fontSize: 11, color: C.greenGrey, letterSpacing: '0.08em' }}>AI ENGINE</div>
          <div style={{ fontFamily: FD, fontSize: 18, color: C.white, textAlign: 'center', lineHeight: 1.25 }}>
            Rerouting
            <br />
            Engine
          </div>
          <div style={{ fontFamily: FB, fontSize: 11, color: C.white, opacity: 0.82 }}>
            Decisioning + guardrails
          </div>
        </div>

        {INTEGRATIONS.map((ig, i) => (
          <div key={ig.name}>
            <div style={{
              position: 'absolute',
              left: serviceX[i],
              top: topY,
              width: boxWidth,
              height: boxHeight,
              background: phase >= 1 ? C.white : C.lightGrey,
              border: `1.5px solid ${phase >= 1 ? statusColor(ig.status) : C.border}`,
              borderTop: `4px solid ${phase >= 1 ? statusColor(ig.status) : C.border}`,
              borderRadius: 2,
              padding: '16px 11px 12px',
              boxSizing: 'border-box',
              boxShadow: SURFACE_SHADOW,
              transition: `all 0.45s ease ${i * 90}ms`,
              ...fade(phase, 1, i * 90),
            }}>
              <div style={{ fontFamily: FB, fontSize: 13, fontWeight: 700, color: C.black, lineHeight: 1.2 }}>{ig.name}</div>
              <div style={{ fontFamily: FB, fontSize: 11, color: C.grey, marginTop: 5 }}>{ig.type}</div>
              <div style={{ marginTop: 8 }}>
                <StatusBadge s={ig.status} label={ig.badge} />
              </div>
            </div>

            <div style={{
              position: 'absolute',
              left: serviceX[i],
              top: noteY,
              width: boxWidth,
              height: noteHeight,
              background: `${statusBg(ig.status)}C8`,
              border: `1px solid ${phase >= 3 ? statusColor(ig.status) : C.border}`,
              borderRadius: 2,
              padding: '9px 10px',
              boxSizing: 'border-box',
              opacity: phase >= 3 ? 1 : 0,
              transition: `opacity 0.4s ease ${i * 80}ms, border-color 0.4s ease`,
            }}>
              <div style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, color: statusColor(ig.status), letterSpacing: '0.05em' }}>
                VULNERABILITY
              </div>
              <div style={{ fontFamily: FB, fontSize: 11, color: C.ash, lineHeight: 1.45, marginTop: 5 }}>
                {ig.note}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', ...fade(phase, 4, 200),
      }}>
        {[
          { label: '2 LIVE', s: 'green' },
          { label: '1 MINOR FIX', s: 'amber' },
          { label: '1 ESCALATED', s: 'red' },
        ].map(b => (
          <div key={b.label} style={{
            background: statusBg(b.s), border: `1px solid ${statusColor(b.s)}30`,
            borderRadius: 2, padding: '6px 14px', textAlign: 'center',
          }}>
            <div style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, color: statusColor(b.s) }}>{b.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SCENE 4: DEMO (Package Rerouting) ───────────────────────────────────────
const PACKAGES = [
  {
    id: 'POST-24018',
    priority: 'Prio C',
    value: 'NOK 420',
    weight: '2.1 kg',
    parcelType: 'Norgespakke (B2C)',
    riskS: 'green',
    originalRoute: 'Oslo → Bergen via E16',
    roadProblem: 'Storm closure on Filefjell shuts the planned mountain crossing.',
    proposedRoute: 'Oslo → Drammen → Bergen via E134 + E39',
    reasoning: 'Low value, high certainty of delivery',
    outcome: 'Auto approve',
    icon: '📦',
  },
  {
    id: 'POST-24019',
    priority: 'Prio B',
    value: 'NOK 3,400',
    weight: '8.5 kg',
    parcelType: 'Pakke Hjem Pluss',
    riskS: 'amber',
    originalRoute: 'Stavanger → Trondheim via ferry',
    roadProblem: 'High wind grounds a ferry leg and adds significant ETA variance.',
    proposedRoute: 'Stavanger → Bergen → Trondheim via road + overnight ferry',
    reasoning: 'Higher parcel value with medium delivery certainty requires dispatcher review',
    outcome: 'Human approval',
    icon: '📬',
  },
  {
    id: 'POST-24020',
    priority: 'Prio A',
    value: 'NOK 8,900',
    weight: '22 kg',
    parcelType: 'Termo (Medical Device)',
    riskS: 'red',
    originalRoute: 'Bergen → Ålesund via E39',
    roadProblem: 'Landslide closes E39 and the backup ferry lane is fully booked.',
    proposedRoute: 'Hold at Bergen hub until protected medical lane opens',
    reasoning: 'High value with low certainty of safe delivery cannot be auto-rerouted',
    outcome: 'Case opened',
    icon: '🚨',
  },
];

function SceneDemo({ phase }) {
  const statusColor = s => s === 'green' ? C.sGreen : s === 'amber' ? C.sAmber : C.sRed;
  const statusBg    = s => s === 'green' ? C.sGreenBg : s === 'amber' ? C.sAmberBg : C.sRedBg;

  return (
    <div style={{ display: 'flex', gap: 14, height: '100%', alignItems: 'stretch', paddingTop: 4 }}>
      {PACKAGES.map((pkg, i) => {
        const showProblem = phase >= 2;
        const showProposal = phase >= 3;
        const showOutcome = phase >= 4;

        return (
          <div key={pkg.id} style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            background: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: 2,
            overflow: 'hidden',
            borderTop: `3px solid ${statusColor(pkg.riskS)}`,
            boxShadow: SURFACE_SHADOW,
            ...fade(phase, 1, i * 120),
          }}>
            <div style={{ padding: '10px 12px 8px', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ fontSize: 22 }}>{pkg.icon}</div>
                <div style={{ flexShrink: 0 }}>
                  <StatusBadge s={pkg.riskS} label={pkg.riskS === 'green' ? 'LOW RISK' : pkg.riskS === 'amber' ? 'REVIEW' : 'HIGH RISK'} />
                </div>
              </div>
              <div style={{ fontFamily: FB, fontSize: 13, fontWeight: 700, color: C.black, marginTop: 4 }}>
                {pkg.id} ({pkg.priority})
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: FB, fontSize: 11, color: C.grey }}>{pkg.value}</span>
                <span style={{ fontFamily: FB, fontSize: 11, color: C.grey }}>·</span>
                <span style={{ fontFamily: FB, fontSize: 11, color: C.grey }}>{pkg.weight}</span>
                <span style={{ fontFamily: FB, fontSize: 11, color: C.grey }}>·</span>
                <span style={{ fontFamily: FB, fontSize: 11, color: C.grey }}>{pkg.parcelType}</span>
              </div>
            </div>

            <div style={{ padding: '0 12px 4px', display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
              <div style={{
                background: C.bgNear,
                border: `1px solid ${C.border}`,
                borderRadius: 2,
                padding: '8px 9px',
              }}>
                <div style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, color: C.grey, letterSpacing: '0.06em' }}>
                  ORIGINAL ROUTE
                </div>
                <div style={{ fontFamily: FB, fontSize: 12, color: C.ash, lineHeight: 1.45, marginTop: 5 }}>
                  {pkg.originalRoute}
                </div>
              </div>

              <div style={{
                background: showProblem ? `${statusBg(pkg.riskS)}D5` : C.bgNear,
                border: `1px solid ${showProblem ? statusColor(pkg.riskS) : C.border}`,
                borderRadius: 2,
                padding: '8px 9px',
                transition: 'background 0.45s ease, border-color 0.45s ease',
              }}>
                <div style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, color: showProblem ? statusColor(pkg.riskS) : C.grey, letterSpacing: '0.06em' }}>
                  PROBLEM ON THE ROAD
                </div>
                <div style={{ fontFamily: FB, fontSize: 12, color: C.ash, lineHeight: 1.45, marginTop: 5 }}>
                  {pkg.roadProblem}
                </div>
              </div>

              <FlowDivider active={showProposal} compact />

              <div style={{
                background: showProposal ? C.white : C.bgNear,
                border: `1px solid ${showProposal ? C.blueGreen : C.border}`,
                borderRadius: 2,
                padding: '8px 9px',
                transition: 'background 0.45s ease, border-color 0.45s ease',
              }}>
                <div style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, color: showProposal ? C.blueGreen : C.grey, letterSpacing: '0.06em' }}>
                  PROPOSED NEW ROUTE
                </div>
                <div style={{ fontFamily: FB, fontSize: 12, color: C.ash, lineHeight: 1.45, marginTop: 5 }}>
                  {pkg.proposedRoute}
                </div>
              </div>

              <FlowDivider active={showProposal} compact />

              <div style={{
                background: showProposal ? '#F7FAF9' : C.bgNear,
                border: `1px solid ${showProposal ? `${C.blueGreen}55` : C.border}`,
                borderRadius: 2,
                padding: '8px 9px',
                transition: 'background 0.45s ease, border-color 0.45s ease',
              }}>
                <div style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, color: showProposal ? C.blueGreen : C.grey, letterSpacing: '0.06em' }}>
                  REASONING
                </div>
                <div style={{ fontFamily: FB, fontSize: 12, color: C.ash, lineHeight: 1.45, marginTop: 5 }}>
                  {pkg.reasoning}
                </div>
              </div>

              <FlowDivider active={showOutcome} compact color={statusColor(pkg.riskS)} />

              <div style={{
                marginTop: 'auto',
                background: showOutcome ? statusBg(pkg.riskS) : C.lightGrey,
                border: `1px solid ${showOutcome ? statusColor(pkg.riskS) : C.border}`,
                borderRadius: 2,
                padding: '9px 10px',
                transition: 'background 0.45s ease, border-color 0.45s ease',
              }}>
                <div style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, color: showOutcome ? statusColor(pkg.riskS) : C.grey, letterSpacing: '0.06em' }}>
                  OUTCOME
                </div>
                <div style={{ fontFamily: FB, fontSize: 13, fontWeight: 700, color: showOutcome ? statusColor(pkg.riskS) : C.ash, marginTop: 6 }}>
                  {pkg.outcome}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── SCENE 5: DELIVERY (Regional Rollout) ─────────────────────────────────────
const DELIVERY_REGIONS = [
  { name: 'Østlandet',  regionKey: 'ostlandet',  status: 'green',  kpi: '87% (+16pp)', metric: 'On-time delivery'       },
  { name: 'Vestlandet', regionKey: 'vestlandet', status: 'green',  kpi: 'NPS +9',      metric: 'Customer NPS'            },
  { name: 'Trøndelag',  regionKey: 'trondelag',  status: 'amber',  kpi: '60% trained', metric: 'Dispatcher training'     },
  { name: 'Nord-Norge', regionKey: 'nord_norge', status: 'locked', kpi: 'Planned W6',  metric: 'Week 6 target'           },
];

function SceneDelivery({ phase }) {
  const statusColor = s => s === 'green' ? C.sGreen : s === 'amber' ? C.sAmber : s === 'locked' ? C.grey : C.sRed;
  const statusFill  = s => s === 'green' ? '#A7F3C0' : s === 'amber' ? '#FDE68A' : s === 'locked' ? '#D1D5DB' : C.sRedBg;

  // Build region colors from phase
  const regionColors = {};
  DELIVERY_REGIONS.forEach((r, i) => {
    if (phase >= i + 1) {
      regionColors[r.regionKey] = statusFill(r.status);
    }
  });

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'minmax(320px, 390px) minmax(260px, 1fr)',
      gap: 18,
      height: '100%',
      alignItems: 'flex-start',
      paddingTop: 4,
    }}>
      {/* Real Norway map with region coloring */}
      <NorwayCountryBox
        regionColors={regionColors}
        defaultCountyFill={MAP_NEUTRAL_FILL}
        outlineFill={MAP_OUTLINE_FILL}
        strokeColor={MAP_STROKE}
        strokeWidth={0.8}
        mapWidth={300}
        minHeight="clamp(400px, 52vh, 520px)"
        frameStyle={{ ...MAP_FRAME, padding: '14px 12px 14px', ...fade(phase, 0) }}
      />

      {/* Region KPI list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 8, maxWidth: 560 }}>
        <div style={{ fontFamily: FB, fontSize: 11, letterSpacing: '0.06em', color: C.grey, ...fade(phase, 0) }}>
          REGIONAL KPI DRIVERS
        </div>
        {DELIVERY_REGIONS.map((r, i) => (
          <div key={r.name} style={{
            ...SURFACE_CARD,
            padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderLeft: `3px solid ${phase >= i + 1 ? statusColor(r.status) : C.border}`,
            transition: `border-left-color 0.8s ease ${i * 200}ms`,
            ...fade(phase, 0, i * 100),
          }}>
            <div>
              <div style={{ fontFamily: FB, fontSize: 12, fontWeight: 700, color: C.black }}>{r.name}</div>
              <div style={{ fontFamily: FB, fontSize: 11, color: C.grey, marginTop: 2 }}>{r.metric}</div>
            </div>
            <div style={{
              fontFamily: FD, fontSize: 18,
              color: phase >= i + 1 ? statusColor(r.status) : C.grey,
              transition: `color 0.8s ease ${i * 200}ms`,
            }}>{phase >= i + 1 ? r.kpi : '—'}</div>
          </div>
        ))}

        {/* Half Double callout */}
        <div style={{
          background: C.blueGreen, borderRadius: 2, padding: '12px 14px',
          ...fade(phase, 5, 200),
        }}>
          <div style={{ fontFamily: FB, fontSize: 11, color: C.greenGrey, letterSpacing: '0.05em' }}>HALF DOUBLE METHODOLOGY</div>
          <div style={{ fontFamily: FD, fontSize: 13, color: C.white, marginTop: 4, lineHeight: 1.5, fontStyle: 'italic' }}>
            Impact delivered region by region — learning informs each wave
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SCENE 6: DEPLOYMENT ─────────────────────────────────────────────────────
const ROLES = [
  {
    role: 'Route Planner',
    modules: ['AI rerouting overview', 'Using the dashboard', 'Feedback loops'],
    complete: 96, color: C.blueGreen,
  },
  {
    role: 'Dispatcher',
    modules: ['HITL decision protocols', 'Escalation paths', 'Edge case handling'],
    complete: 94, color: C.blueGreen,
  },
  {
    role: 'Depot Manager',
    modules: ['KPI reading & reporting', 'CoE responsibilities', 'Change leadership'],
    complete: 88, color: C.sAmber,
  },
];

function SceneDeploy({ phase }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 8 }}>
      {/* Learning paths */}
      <div style={{ fontFamily: FB, fontSize: 11, letterSpacing: '0.06em', color: C.grey, ...fade(phase, 0) }}>
        ROLE-BASED LEARNING PATHS
      </div>
      <div style={{ display: 'flex', gap: 12, ...fade(phase, 1) }}>
        {ROLES.map((r, i) => (
          <div key={r.role} style={{
            flex: 1, background: C.white, border: `1px solid ${C.border}`, borderRadius: 2,
            padding: '12px 14px',
          }}>
            <div style={{ fontFamily: FB, fontSize: 11, fontWeight: 700, color: C.black }}>{r.role}</div>
            <div style={{ margin: '8px 0' }}>
              {r.modules.map((m, mi) => (
                <div key={mi} style={{
                  fontFamily: FB, fontSize: 11, color: C.ash, padding: '3px 0',
                  borderBottom: mi < r.modules.length - 1 ? `1px solid ${C.border}` : 'none',
                }}>✓ {m}</div>
              ))}
            </div>
            <div style={{ height: 5, background: C.border, borderRadius: 3, overflow: 'hidden', marginTop: 8 }}>
              <div style={{
                height: '100%', width: phase >= 2 ? `${r.complete}%` : '0%',
                background: r.color, borderRadius: 3,
                transition: `width 1.2s ease ${i * 200}ms`,
              }} />
            </div>
            <div style={{ fontFamily: FB, fontSize: 11, color: r.color, marginTop: 4, fontWeight: 700 }}>
              {phase >= 2 ? `${r.complete}% complete` : ''}
            </div>
          </div>
        ))}
      </div>

      {/* Trust checkpoints + 90-day review */}
      <div style={{ display: 'flex', gap: 12, ...fade(phase, 2, 200) }}>
        <div style={{
          flex: 1, background: C.white, border: `1px solid ${C.border}`, borderRadius: 2, padding: '12px 14px',
        }}>
          <div style={{ fontFamily: FB, fontSize: 11, color: C.grey, letterSpacing: '0.05em' }}>TRUST CHECKPOINTS</div>
          {['Week 2: Pilot dispatcher sign-off', 'Week 4: Regional manager review', 'Week 8: Full ops handover'].map((t, ti) => (
            <div key={ti} style={{
              display: 'flex', gap: 8, alignItems: 'center',
              padding: '5px 0', borderBottom: ti < 2 ? `1px solid ${C.border}` : 'none',
            }}>
              <span style={{ color: C.sGreen, fontSize: 12 }}>✓</span>
              <span style={{ fontFamily: FB, fontSize: 11, color: C.ash }}>{t}</span>
            </div>
          ))}
        </div>

        <div style={{
          background: C.sGreenBg, border: `1px solid ${C.sGreen}40`, borderRadius: 2,
          padding: '12px 14px', minWidth: 160,
        }}>
          <div style={{ fontFamily: FB, fontSize: 11, color: C.sGreen, letterSpacing: '0.05em' }}>90-DAY KPI REVIEW</div>
          <div style={{ fontFamily: FD, fontSize: 28, color: C.sGreen, marginTop: 6 }}>88%</div>
          <div style={{ fontFamily: FB, fontSize: 11, color: C.ash }}>On-time delivery<br/>during weather events</div>
          <div style={{
            marginTop: 8, fontFamily: FB, fontSize: 11, fontWeight: 700,
            color: C.sGreen, background: C.white, padding: '4px 8px', borderRadius: 2, display: 'inline-block',
          }}>TARGET: 88% ✓</div>
        </div>
      </div>
    </div>
  );
}

// ─── RIGHT: PIPELINE PANEL ────────────────────────────────────────────────────

// Expanded content per stage (compact, for the right panel)
function StageExpandedContent({ stageId }) {
  if (stageId === 'discover') return (
      <div style={{ marginTop: 12, minWidth: 0 }}>
      {/* Mini value tree */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontFamily: FB, fontSize: 10, color: C.grey, letterSpacing: '0.05em', marginBottom: 6 }}>WHERE DOES THE VALUE COME FROM?</div>
        <svg viewBox="0 0 280 130" width="100%" style={{ display: 'block' }}>
          {/* Root */}
          <rect x="80" y="2" width="120" height="28" rx="2" fill={C.blueGreen} />
          <text x="140" y="12" textAnchor="middle" fontFamily={FD} fontSize="10" fill="white">NOK 40M</text>
          <text x="140" y="24" textAnchor="middle" fontFamily={FB} fontSize="9" fill={C.greenGrey}>annual impact</text>
          {/* Branches */}
          {[
            { x: 20, label1: 'Fewer', label2: 'delayed parcels', sub1: 'On-time +17pp', sub2: 'Recovery +12%' },
            { x: 105, label1: 'Lower', label2: 'compensation', sub1: 'Claims −34%', sub2: 'SLA cost −NOK 8M' },
            { x: 190, label1: 'Higher', label2: 'NPS score', sub1: 'NPS +11pts', sub2: 'CSAT +23%' },
          ].map((b, i) => (
            <g key={i}>
              <line x1={140} y1={30} x2={b.x + 40} y2={60} stroke={C.greenGrey} strokeWidth="1" />
              <rect x={b.x} y={60} width="80" height="22" rx="2" fill={C.bgNear} stroke={C.border} strokeWidth="1" />
              <text x={b.x + 40} y={71} textAnchor="middle" fontFamily={FB} fontSize="8.5" fill={C.ash}>{b.label1}</text>
              <text x={b.x + 40} y={80} textAnchor="middle" fontFamily={FB} fontSize="8.5" fill={C.ash}>{b.label2}</text>
              <text x={b.x + 10} y={100} fontFamily={FB} fontSize="8" fill={C.blueGreen}>{b.sub1}</text>
              <text x={b.x + 10} y={112} fontFamily={FB} fontSize="8" fill={C.blueGreen}>{b.sub2}</text>
            </g>
          ))}
        </svg>
      </div>
      {/* KPI cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
        gap: 6,
        marginBottom: 10,
      }}>
        {[
          { label: 'On-time (weather)', from: '71%', to: '88%' },
          { label: 'Compensation costs', from: 'NOK 12M', to: 'NOK 8M' },
          { label: 'NPS score', from: '34', to: '45' },
        ].map(k => (
          <div key={k.label} style={{
            minWidth: 0,
            background: C.bgNear, border: `1px solid ${C.border}`, borderRadius: 2, padding: '6px 8px',
          }}>
            <div style={{ fontFamily: FB, fontSize: 10, color: C.grey, marginBottom: 3 }}>{k.label}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ fontFamily: FD, fontSize: 12, color: C.ash }}>{k.from}</span>
              <span style={{ color: C.blueGreen, fontSize: 11 }}>→</span>
              <span style={{ fontFamily: FD, fontSize: 12, color: C.sGreen, fontWeight: 'bold' }}>{k.to}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Business owner + Half Double */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 6,
      }}>
        <div style={{
          background: C.white, border: `1px solid ${C.border}`, borderRadius: 2,
          padding: '6px 10px', flex: 1,
        }}>
          <div style={{ fontFamily: FB, fontSize: 10, color: C.grey }}>BUSINESS OWNER</div>
          <div style={{ fontFamily: FB, fontSize: 12, color: C.black, fontWeight: 700, marginTop: 2 }}>Kari Andersen</div>
          <div style={{ fontFamily: FB, fontSize: 10, color: C.ash }}>VP Operations · Posten Bring</div>
        </div>
        <div style={{
          background: C.blueGreen, borderRadius: 2, padding: '6px 10px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <div style={{ fontFamily: FB, fontSize: 10, color: C.greenGrey }}>METHODOLOGY</div>
          <div style={{ fontFamily: FD, fontSize: 12, color: C.white, fontStyle: 'italic' }}>Half Double_</div>
        </div>
      </div>
    </div>
  );

  if (stageId === 'design') return (
    <div style={{ marginTop: 10 }}>
      <div style={{ fontFamily: FB, fontSize: 10, color: C.grey, letterSpacing: '0.05em', marginBottom: 8 }}>SOLUTION INCREMENTS</div>
      {[
        { week: 'Sprint 1', desc: 'Rule-based rerouting for low-risk parcels', done: true },
        { week: 'Sprint 2', desc: 'ML confidence scoring + HITL queue', done: true },
        { week: 'Sprint 3', desc: 'Full decision engine with API integrations', done: false },
        { week: 'Sprint 4', desc: 'Dispatcher UI + feedback loop training', done: false },
      ].map((s, i) => (
        <div key={i} style={{
          display: 'flex', gap: 8, padding: '6px 0',
          borderBottom: i < 3 ? `1px solid ${C.border}` : 'none', alignItems: 'flex-start',
        }}>
          <span style={{ fontFamily: FB, fontSize: 10, fontWeight: 700, color: C.blueGreen, minWidth: 50 }}>{s.week}</span>
          <span style={{ fontFamily: FB, fontSize: 11, color: C.ash, flex: 1 }}>{s.desc}</span>
          <span style={{ fontSize: 11 }}>{s.done ? '✓' : '○'}</span>
        </div>
      ))}
    </div>
  );

  if (stageId === 'detail') return (
    <div style={{ marginTop: 10 }}>
      <div style={{ fontFamily: FB, fontSize: 10, color: C.grey, letterSpacing: '0.05em', marginBottom: 6 }}>VULNERABILITY FINDINGS</div>
      {[
        { s: 'green', text: 'Single-source weather data — YR.NO SLA 99.5%' },
        { s: 'amber', text: 'Route Optimizer schema drift — monitoring added' },
        { s: 'red',   text: 'Fleet GPS excluded — human fallback protocol defined' },
        { s: 'green', text: 'GDPR: no PII in model inputs confirmed by DPO' },
      ].map((c, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, padding: '5px 0', borderBottom: i < 3 ? `1px solid ${C.border}` : 'none' }}>
          <span style={{
            color: c.s === 'green' ? C.sGreen : c.s === 'amber' ? C.sAmber : C.sRed,
            fontWeight: 700, fontSize: 11, minWidth: 14,
          }}>{c.s === 'green' ? '✓' : c.s === 'amber' ? '⚠' : '✗'}</span>
          <span style={{ fontFamily: FB, fontSize: 11, color: C.ash }}>{c.text}</span>
        </div>
      ))}
    </div>
  );

  if (stageId === 'decision') return (
    <div style={{ marginTop: 10 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
        gap: 8,
        marginBottom: 10,
      }}>
        {[
          { label: 'Model accuracy', val: '91%' },
          { label: 'HITL acceptance', val: '97%' },
          { label: 'Avg. reroute time', val: '2.3s' },
        ].map(m => (
          <div key={m.label} style={{
            minWidth: 0,
            background: C.sGreenBg, border: `1px solid ${C.sGreen}30`, borderRadius: 2, padding: '8px 6px', textAlign: 'center',
          }}>
            <div style={{ fontFamily: FD, fontSize: 18, color: C.sGreen }}>{m.val}</div>
            <div style={{ fontFamily: FB, fontSize: 10, color: C.ash, marginTop: 2 }}>{m.label}</div>
          </div>
        ))}
      </div>
      <div style={{
        background: C.sGreenBg, border: `1px solid ${C.sGreen}40`, borderRadius: 2,
        padding: '10px 12px', textAlign: 'center',
      }}>
        <div style={{ fontFamily: FD, fontSize: 16, color: C.sGreen }}>Decision: GO ✓</div>
        <div style={{ fontFamily: FB, fontSize: 10, color: C.ash, marginTop: 4 }}>
          Steering committee · 15 Apr 2025 · Unanimous
        </div>
      </div>
    </div>
  );

  if (stageId === 'delivery') return (
    <div style={{ marginTop: 10 }}>
      <div style={{ fontFamily: FB, fontSize: 10, color: C.grey, letterSpacing: '0.05em', marginBottom: 8 }}>HALF DOUBLE — IMPACT PER REGION</div>
      {[
        { region: 'Østlandet',  kpi: '87% on-time', s: 'green',  week: 'W1–2' },
        { region: 'Vestlandet', kpi: 'NPS +9pts',   s: 'green',  week: 'W2–3' },
        { region: 'Trøndelag',  kpi: '60% trained', s: 'amber',  week: 'W3–4' },
        { region: 'Nord-Norge', kpi: 'Planned',     s: 'locked', week: 'W5–6' },
      ].map((r, i) => {
        const col = r.s === 'green' ? C.sGreen : r.s === 'amber' ? C.sAmber : C.grey;
        return (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '6px 0', borderBottom: i < 3 ? `1px solid ${C.border}` : 'none',
          }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontFamily: FB, fontSize: 10, color: C.grey, minWidth: 28 }}>{r.week}</span>
              <span style={{ fontFamily: FB, fontSize: 12, color: C.ash }}>{r.region}</span>
            </div>
            <span style={{ fontFamily: FD, fontSize: 13, color: col }}>{r.kpi}</span>
          </div>
        );
      })}
    </div>
  );

  if (stageId === 'deploy') return (
    <div style={{ marginTop: 10 }}>
      {[
        { label: 'Dispatchers certified', val: '200', unit: '94% pass rate' },
        { label: 'HITL decisions reviewed', val: '4,218', unit: 'last 30 days' },
        { label: '90-day on-time delivery', val: '88%', unit: '✓ Target achieved' },
      ].map((m, i) => (
        <div key={i} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '8px 0', borderBottom: i < 2 ? `1px solid ${C.border}` : 'none',
        }}>
          <div>
            <div style={{ fontFamily: FB, fontSize: 11, color: C.ash }}>{m.label}</div>
            <div style={{ fontFamily: FB, fontSize: 10, color: C.grey }}>{m.unit}</div>
          </div>
          <div style={{ fontFamily: FD, fontSize: 20, color: C.blueGreen }}>{m.val}</div>
        </div>
      ))}
    </div>
  );

  return null;
}

function PipelinePanel({ currentStage, phase, onStageClick }) {
  const gateColors = {
    green: C.sGreen, amber: C.sAmber, red: C.sRed, locked: C.grey,
  };
  const gateBgs = {
    green: C.sGreenBg, amber: C.sAmberBg, red: C.sRedBg, locked: C.lightGrey,
  };
  const gateIcons = { green: '✓', amber: '⚠', red: '✗', locked: '○' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%', overflowY: 'auto' }}>
      {STAGES.map((s, i) => {
        const isActive = i === currentStage;
        const isPast   = i < currentStage;
        const isLocked = i > currentStage;
        const gs = isLocked ? 'locked' : s.gateStatus;

        return (
          <div key={s.id} style={{
            borderBottom: `1px solid ${C.border}`,
            background: isActive ? C.white : 'transparent',
            cursor: 'pointer',
            transition: 'background 0.3s ease',
          }} onClick={() => onStageClick(i)}>
            {/* Stage header row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
              opacity: isLocked ? 0.45 : 1,
              minWidth: 0,
            }}>
              {/* Number bubble */}
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: isActive ? C.blueGreen : isPast ? gateBgs[s.gateStatus] : C.lightGrey,
                border: `1.5px solid ${isActive ? C.blueGreen : isPast ? gateColors[s.gateStatus] : C.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FB, fontSize: 11, fontWeight: 700,
                color: isActive ? C.white : isPast ? gateColors[s.gateStatus] : C.grey,
              }}>
                {isPast ? gateIcons[s.gateStatus] : s.num}
              </div>

              {/* Label */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FB, fontSize: 10, letterSpacing: '0.07em', color: C.grey }}>{s.label}</div>
                <div style={{ fontFamily: FB, fontSize: 13, fontWeight: 700, color: isLocked ? C.grey : C.black }}>
                  {s.title}
                </div>
              </div>

              {/* Gate badge */}
              {(isActive || isPast) && (
                <span style={{
                  fontFamily: FB, fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
                  color: gateColors[gs], background: gateBgs[gs],
                  padding: '3px 7px', borderRadius: 2, whiteSpace: 'nowrap', flexShrink: 0,
                }}>{s.gateLabel}</span>
              )}
              {isLocked && (
                <span style={{ color: C.grey, fontSize: 14 }}>🔒</span>
              )}
            </div>

            {/* Expanded content for active stage */}
            {isActive && (
              <div style={{ padding: '0 16px 14px 16px' }}>
                {/* Gate checks */}
                <div style={{ marginBottom: 4 }}>
                  {s.gateChecks.map((c, ci) => (
                    <CheckRow key={ci} s={c.s} text={c.text} visible={phase >= ci + 1} />
                  ))}
                </div>
                {/* Stage-specific expanded detail */}
                <StageExpandedContent stageId={s.id} phase={phase} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── LEFT PANEL SCENE SWITCHER ────────────────────────────────────────────────
function LeftScene({ stage, phase }) {
  const scenes = [SceneDiscover, SceneDataPlatform, SceneIntegration, SceneDemo, SceneDelivery, SceneDeploy];
  const Scene = scenes[stage];
  const stageZoom = stage === 3 ? 0.988 : stage === 0 || stage === 4 ? 0.994 : 1;

  return (
    <div style={{ height: '100%', overflow: 'hidden', padding: '0 4px' }}>
      <div style={{ zoom: stageZoom }}>
        <Scene phase={phase} />
      </div>
    </div>
  );
}

// ─── PLAYBACK CONTROLS ────────────────────────────────────────────────────────
function ControlBar({ stage, isPlaying, onPlay, onPrev, onNext, onRestart, onStageJump }) {
  return (
    <div style={{
      background: C.black, borderTop: `1px solid ${C.ash}`,
      padding: '8px 18px', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0,
    }}>
      {/* Buttons */}
      <button onClick={onRestart} style={ctrlBtn(C.grey)} title="Restart">↺</button>
      <button onClick={onPrev} style={ctrlBtn(C.grey)} title="Previous">◀</button>
      <button onClick={onPlay} style={ctrlBtn(C.blueGreen, true)} title={isPlaying ? 'Pause' : 'Play'}>
        {isPlaying ? '⏸' : '▶'}
      </button>
      <button onClick={onNext} style={ctrlBtn(C.grey)} title="Next">▶</button>

      {/* Stage dots */}
      <div style={{ display: 'flex', gap: 6, flex: 1, justifyContent: 'center' }}>
        {STAGES.map((s, i) => (
          <button key={s.id} onClick={() => onStageJump(i)} style={{
            width: i === stage ? 28 : 8, height: 8, borderRadius: 4, border: 'none', cursor: 'pointer',
            background: i < stage ? C.blueGreen : i === stage ? C.greenGrey : C.ash,
            transition: 'all 0.3s ease', padding: 0,
          }} title={s.label} />
        ))}
      </div>

      {/* Stage label */}
      <div style={{ textAlign: 'right', minWidth: 160 }}>
        <div style={{ fontFamily: FB, fontSize: 10, color: C.grey, letterSpacing: '0.08em' }}>
          STAGE {stage + 1} OF 6
        </div>
        <div style={{ fontFamily: FB, fontSize: 12, fontWeight: 700, color: C.white }}>
          {STAGES[stage].label}: {STAGES[stage].title}
        </div>
      </div>
    </div>
  );
}

function ctrlBtn(col, big = false) {
  return {
    background: 'transparent', border: `1px solid ${col}`,
    color: col, borderRadius: 2, width: big ? 40 : 32, height: big ? 40 : 32,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', fontFamily: FB, fontSize: big ? 16 : 13,
    flexShrink: 0,
  };
}

// ─── LEFT PANEL TITLES ────────────────────────────────────────────────────────
const LEFT_TITLES = [
  { label: 'DISCOVERY', title: 'Mapping the impact case' },
  { label: 'DATA PLATFORM', title: 'Data domains & stewardship' },
  { label: 'INTEGRATION CHECKS', title: 'Architecture readiness assessment' },
  { label: 'DEMO', title: 'AI rerouting engine in action' },
  { label: 'DELIVERY', title: 'Regional rollout — Half Double' },
  { label: 'DEPLOYMENT', title: 'Adoption & organisational change' },
];

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [stage, setStage]     = useState(0);
  const [phase, setPhase]     = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef           = useRef(null);

  const maxPhase = STAGES[stage].maxPhase;

  const tick = useEffectEvent(() => {
    setPhase(p => {
      if (p < maxPhase) return p + 1;
      setPlaying(false);
      return p;
    });
  });

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => tick(), 1400);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, maxPhase]);

  const jumpStage = (i) => {
    clearInterval(intervalRef.current);
    setStage(i);
    setPhase(0);
    setPlaying(false);
  };

  const handleNext = () => {
    if (phase < maxPhase) {
      setPhase(p => p + 1);
    } else if (stage < STAGES.length - 1) {
      jumpStage(stage + 1);
    }
  };

  const handlePrev = () => {
    if (phase > 0) {
      setPhase(p => p - 1);
    } else if (stage > 0) {
      jumpStage(stage - 1);
    }
  };

  const handleRestart = () => jumpStage(0);
  const handlePlay    = () => setPlaying(p => !p);

  const { label, title } = LEFT_TITLES[stage];

  return (
    <div style={{
      width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column',
      background: C.egg, fontFamily: FB, overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        background: C.black, padding: '6px 22px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0, borderBottom: `2px solid ${C.blueGreen}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* IM_ wordmark (text-based) */}
          <div style={{ fontFamily: FB, fontWeight: 700, fontSize: 16, color: C.white, letterSpacing: '0.05em' }}>
            IM_
          </div>
          <div style={{ width: 1, height: 24, background: C.ash }} />
          <div>
            <div style={{ fontFamily: FB, fontSize: 10, color: C.grey, letterSpacing: '0.1em' }}>
              IMPLEMENT CONSULTING GROUP
            </div>
            <div style={{ fontFamily: FD, fontSize: 15, color: C.white, fontStyle: 'italic' }}>
              AI Delivery Methodology
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: FB, fontSize: 10, color: C.grey, letterSpacing: '0.08em' }}>USE CASE</div>
          <div style={{ fontFamily: FB, fontSize: 12, fontWeight: 700, color: C.greenGrey }}>
            Dynamic Parcel Rerouting · Posten Bring
          </div>
        </div>
      </div>

      {/* Split content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minWidth: 0 }}>
        {/* LEFT PANEL */}
        <div style={{
          flex: '0 0 57%', padding: '14px 18px 8px 18px',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxSizing: 'border-box', minWidth: 0,
          borderRight: `1px solid ${C.border}`,
        }}>
          {/* Left panel header */}
          <div style={{ marginBottom: 8, flexShrink: 0 }}>
            <div style={{
              display: 'inline-block',
              background: C.blueGreen, color: C.white,
              fontFamily: FB, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
              padding: '3px 10px', borderRadius: 2, marginBottom: 4,
            }}>{label}</div>
            <div style={{
              fontFamily: FD, fontSize: 20, color: C.black, fontStyle: 'italic',
            }}>{title}</div>
          </div>
          {/* Scene */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <LeftScene stage={stage} phase={phase} />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{
          flex: '0 0 43%', display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxSizing: 'border-box', minWidth: 0,
        }}>
          <div style={{
            padding: '12px 16px 6px 16px', borderBottom: `1px solid ${C.border}`, flexShrink: 0,
          }}>
            <div style={{ fontFamily: FB, fontSize: 10, color: C.grey, letterSpacing: '0.08em' }}>
              AI DELIVERY PIPELINE
            </div>
            <div style={{ fontFamily: FD, fontSize: 16, color: C.black, fontStyle: 'italic' }}>
              Six-stage delivery framework
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <PipelinePanel
              currentStage={stage}
              phase={phase}
              onStageClick={jumpStage}
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <ControlBar
        stage={stage} isPlaying={playing}
        onPlay={handlePlay} onPrev={handlePrev} onNext={handleNext}
        onRestart={handleRestart} onStageJump={jumpStage}
      />
    </div>
  );
}
