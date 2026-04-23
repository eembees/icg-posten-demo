export const impactCaseContent = {
  overall: {
    label: 'OVERALL IMPACT',
    title: 'Dynamic parcel rerouting becomes a weather-resilient operating capability.',
    body: 'The initiative protects parcel SLAs during disruption events, unlocks measurable economic value, and supports Posten Bring priorities on service reliability and scalable AI adoption.',
    metrics: [
      { label: 'Annual impact', value: 'NOK 40M' },
      { label: 'At-risk parcels recovered', value: '53%' },
      { label: 'Primary business priority', value: 'Weather resilience' },
    ],
  },
  business: [
    {
      metric: '71% → 88%',
      title: 'Customer performance',
      body: 'Raise on-time delivery during severe weather and improve customer confidence through fewer broken promises and clearer ETA handling.',
    },
    {
      metric: 'NOK 40M',
      title: 'Financial performance',
      body: 'Reduce compensation and SLA breach costs while protecting parcel revenue by recovering high volumes that would otherwise arrive late.',
    },
    {
      metric: '91%',
      title: 'Process performance',
      body: 'Use confidence-based rerouting to handle low-risk cases automatically and push ambiguous cases into fast dispatcher review.',
    },
    {
      metric: 'GDPR ✓',
      title: 'Sustainability & compliance',
      body: 'Avoid unnecessary repeat runs and manual replanning while keeping decisioning auditable and free of PII in model inputs.',
    },
  ],
  behavioural: {
    label: 'BEHAVIOURAL IMPACT',
    title: 'Operations teams shift from reactive firefighting to structured AI-assisted intervention.',
    body: 'Dispatchers, route planners, and depot leaders apply human-in-the-loop decisioning, shared data stewardship, and clear guardrails across TMS, route planning, and live weather data.',
    tags: ['Human-in-the-loop', 'Cross-functional ownership', 'Operational guardrails'],
  },
  people: [
    {
      metric: 'Adoption',
      title: 'Impact on mindset and motivation',
      body: 'Trust in the engine increases because recommendations are transparent, bounded by confidence thresholds, and linked directly to service KPIs regional teams care about.',
    },
    {
      metric: 'Capability',
      title: 'Impact on skills and competences',
      body: '200 dispatchers and planners build capability in dashboard usage, exception handling, escalation paths, KPI follow-up, and feedback loops to improve the model.',
    },
  ],
};
