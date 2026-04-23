import { impactCaseContent } from "./impactCaseContent.js";

const DEFAULT_COLORS = {
  blueGreen: '#67817F',
  greenGrey: '#B9C7C2',
  black: '#1F1F23',
  ash: '#30373B',
  grey: '#A8A5A1',
  white: '#FFFFFF',
  border: '#E1E6E5',
};

const DISPLAY_FONT = "'Palatino Linotype', Palatino, Georgia, serif";
const BODY_FONT = "Arial, Helvetica, sans-serif";

const defaultFade = (phase, target, delay = 0) => ({
  opacity: phase >= target ? 1 : 0,
  transform: `translateY(${phase >= target ? 0 : 10}px)`,
  transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
  pointerEvents: phase >= target ? 'auto' : 'none',
});

function SavedImpactCard({
  phase,
  target,
  delay = 0,
  label,
  metric,
  title,
  body,
  tone = 'soft',
  minHeight,
  children,
  colors,
  displayFont,
  bodyFont,
  fade,
}) {
  const tones = {
    hero: {
      bg: colors.blueGreen,
      border: `${colors.blueGreen}CC`,
      label: colors.greenGrey,
      metric: colors.white,
      title: colors.white,
      body: 'rgba(255, 255, 255, 0.86)',
      shadow: '0 18px 34px rgba(103, 129, 127, 0.22)',
    },
    business: {
      bg: '#D6E0DD',
      border: '#CBD7D3',
      label: colors.blueGreen,
      metric: colors.black,
      title: colors.black,
      body: colors.ash,
      shadow: '0 10px 24px rgba(31, 31, 35, 0.04)',
    },
    soft: {
      bg: '#F4F7F6',
      border: colors.border,
      label: colors.grey,
      metric: colors.blueGreen,
      title: colors.black,
      body: colors.ash,
      shadow: '0 10px 24px rgba(31, 31, 35, 0.04)',
    },
  };
  const palette = tones[tone];

  return (
    <div style={{
      border: `1px solid ${palette.border}`,
      borderRadius: 2,
      background: palette.bg,
      boxShadow: palette.shadow,
      padding: '14px 16px',
      minHeight,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: 10,
      ...fade(phase, target, delay),
    }}>
      <div>
        <div style={{
          fontFamily: bodyFont,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.08em',
          color: label ? palette.label : 'transparent',
          minHeight: 12,
        }}>
          {label || ' '}
        </div>
        {metric && (
          <div style={{
            fontFamily: displayFont,
            fontSize: 22,
            color: palette.metric,
            lineHeight: 1.05,
            marginTop: 4,
          }}>
            {metric}
          </div>
        )}
        <div style={{
          fontFamily: bodyFont,
          fontSize: tone === 'hero' ? 17 : 15,
          fontWeight: 700,
          color: palette.title,
          lineHeight: tone === 'hero' ? 1.32 : 1.25,
          marginTop: metric ? 7 : 6,
          maxWidth: tone === 'hero' ? 660 : 'none',
        }}>
          {title}
        </div>
        {body && (
          <div style={{
            fontFamily: bodyFont,
            fontSize: 11.5,
            color: palette.body,
            lineHeight: 1.52,
            marginTop: 7,
          }}>
            {body}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

export default function ImpactCaseBoard({
  phase = 4,
  colors = DEFAULT_COLORS,
  displayFont = DISPLAY_FONT,
  bodyFont = BODY_FONT,
  fade = defaultFade,
  surfaceCard = {
    background: DEFAULT_COLORS.white,
    border: `1px solid ${DEFAULT_COLORS.border}`,
    borderRadius: 2,
    boxShadow: '0 14px 32px rgba(31, 31, 35, 0.05)',
  },
}) {
  return (
    <div style={{ height: '100%', paddingTop: 4 }}>
      <div style={{
        ...surfaceCard,
        height: '100%',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 249, 0.9) 100%)',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        <SavedImpactCard
          phase={phase}
          target={1}
          label={impactCaseContent.overall.label}
          title={impactCaseContent.overall.title}
          body={impactCaseContent.overall.body}
          tone="hero"
          minHeight={116}
          colors={colors}
          displayFont={displayFont}
          bodyFont={bodyFont}
          fade={fade}
        >
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {impactCaseContent.overall.metrics.map((item) => (
              <div key={item.label} style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                borderRadius: 2,
                padding: '7px 10px 6px',
                minWidth: 128,
              }}>
                <div style={{ fontFamily: bodyFont, fontSize: 10, color: colors.greenGrey }}>{item.label}</div>
                <div style={{ fontFamily: displayFont, fontSize: 16, color: colors.white, marginTop: 3 }}>{item.value}</div>
              </div>
            ))}
          </div>
        </SavedImpactCard>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
          {impactCaseContent.business.map((card, index) => (
            <SavedImpactCard
              key={card.title}
              phase={phase}
              target={2}
              delay={index * 80}
              label="BUSINESS IMPACT"
              metric={card.metric}
              title={card.title}
              body={card.body}
              tone="business"
              minHeight={126}
              colors={colors}
              displayFont={displayFont}
              bodyFont={bodyFont}
              fade={fade}
            />
          ))}
        </div>

        <SavedImpactCard
          phase={phase}
          target={3}
          label={impactCaseContent.behavioural.label}
          title={impactCaseContent.behavioural.title}
          body={impactCaseContent.behavioural.body}
          tone="soft"
          minHeight={98}
          colors={colors}
          displayFont={displayFont}
          bodyFont={bodyFont}
          fade={fade}
        >
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {impactCaseContent.behavioural.tags.map((tag) => (
              <span key={tag} style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '5px 9px',
                borderRadius: 2,
                border: `1px solid ${colors.border}`,
                background: colors.white,
                fontFamily: bodyFont,
                fontSize: 10,
                fontWeight: 700,
                color: colors.blueGreen,
                letterSpacing: '0.05em',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </SavedImpactCard>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
          {impactCaseContent.people.map((card, index) => (
            <SavedImpactCard
              key={card.title}
              phase={phase}
              target={4}
              delay={index * 90}
              label="ORGANISATIONAL IMPACT"
              metric={card.metric}
              title={card.title}
              body={card.body}
              tone="business"
              minHeight={118}
              colors={colors}
              displayFont={displayFont}
              bodyFont={bodyFont}
              fade={fade}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
