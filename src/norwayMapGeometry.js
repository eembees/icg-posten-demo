const TRANSLATED_COUNTIES = new Set([
  'Akershus',
  'Rogaland',
  'Hordaland',
  'Sogn_og_Fjordane',
  'More_og_Romsdal',
  'Sor_Trondelag',
  'Nord_Trondelag',
  'Nordland',
  'Troms',
  'Finnmark',
]);

const COUNTY_TRANSLATE_X = -120.0081;
const COUNTY_TRANSLATE_Y = -234.8077;

export function getCountyTranslation(countyId) {
  if (!TRANSLATED_COUNTIES.has(countyId)) {
    return { x: 0, y: 0 };
  }

  return { x: COUNTY_TRANSLATE_X, y: COUNTY_TRANSLATE_Y };
}

export function translateMapPoint(x, y, countyId) {
  const offset = getCountyTranslation(countyId);
  return {
    x: x + offset.x,
    y: y + offset.y,
  };
}
