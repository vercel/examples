import { DELAY, REGIONS, STORE_URL } from './constants'
import type { Country, Product } from './types'

const PRODUCT: Product = {
  id: 'mug-nextjs',
  name: 'Vercel Mug',
  description: 'Limited Edition',
  price: 15,
  image: '/mug.png',
  discount: REGIONS['1'].discount,
  link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
}
export const PRODUCTS: Record<string, Product> = {
  // Afghanistan
  af: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Albania
  al: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Algeria
  dz: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // American Samoa
  as: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Andorra
  ad: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Angola
  ao: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Anguilla
  ai: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Antarctica
  aq: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Antigua and Barbuda
  ag: {
    ...PRODUCT,
    discount: REGIONS['4'].discount,
    link: `${STORE_URL}/cart/${REGIONS['4'].id}:1`,
  },
  // Argentina
  ar: {
    ...PRODUCT,
    name: 'Taza Vercel',
    description: 'Edición Limitada',
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Armenia
  am: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Aruba
  aw: {
    ...PRODUCT,
    discount: REGIONS['4'].discount,
    link: `${STORE_URL}/cart/${REGIONS['4'].id}:1`,
  },
  // Australia
  au: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Austria
  at: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Azerbaijan
  az: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Bahamas (the)
  bs: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Bahrain
  bh: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Bangladesh
  bd: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Barbados
  bb: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Belarus
  by: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Belgium
  be: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Belize
  bz: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Benin
  bj: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Bermuda
  bm: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Bhutan
  bt: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Bolivia (Plurinational State of)
  bo: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Bonaire, Sint Eustatius and Saba
  bq: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Bosnia and Herzegovina
  ba: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Botswana
  bw: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Bouvet Island
  bv: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Brazil
  br: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // British Indian Ocean Territory (the)
  io: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Brunei Darussalam
  bn: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Bulgaria
  bg: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Burkina Faso
  bf: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Burundi
  bi: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Cabo Verde
  cv: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Cambodia
  kh: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Cameroon
  cm: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Canada
  ca: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Cayman Islands (the)
  ky: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Central African Republic (the)
  cf: {
    ...PRODUCT,
    discount: REGIONS['4'].discount,
    link: `${STORE_URL}/cart/${REGIONS['4'].id}:1`,
  },
  // Chad
  td: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Chile
  cl: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // China
  cn: {
    ...PRODUCT,
    name: 'Vercel 马克杯',
    description: '限量版',
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Christmas Island
  cx: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Cocos (Keeling) Islands (the)
  cc: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Colombia
  co: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Comoros (the)
  km: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Congo (the Democratic Republic of the)
  cd: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Congo (the)
  cg: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Cook Islands (the)
  ck: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Costa Rica
  cr: {
    ...PRODUCT,
    discount: REGIONS['4'].discount,
    link: `${STORE_URL}/cart/${REGIONS['4'].id}:1`,
  },
  // Croatia
  hr: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Cuba
  cu: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Curaçao
  cw: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Cyprus
  cy: {
    ...PRODUCT,
    discount: REGIONS['3'].discount,
    link: `${STORE_URL}/cart/${REGIONS['3'].id}:1`,
  },
  // Czechia
  cz: {
    ...PRODUCT,
    discount: REGIONS['4'].discount,
    link: `${STORE_URL}/cart/${REGIONS['4'].id}:1`,
  },
  // Côte d'Ivoire
  ci: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Denmark
  dk: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Djibouti
  dj: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Dominica
  dm: {
    ...PRODUCT,
    discount: REGIONS['3'].discount,
    link: `${STORE_URL}/cart/${REGIONS['3'].id}:1`,
  },
  // Dominican Republic (the)
  do: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Ecuador
  ec: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Egypt
  eg: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // El Salvador
  sv: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Equatorial Guinea
  gq: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Eritrea
  er: {
    ...PRODUCT,
    discount: REGIONS['3'].discount,
    link: `${STORE_URL}/cart/${REGIONS['3'].id}:1`,
  },
  // Estonia
  ee: {
    ...PRODUCT,
    discount: REGIONS['3'].discount,
    link: `${STORE_URL}/cart/${REGIONS['3'].id}:1`,
  },
  // Eswatini
  sz: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Ethiopia
  et: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Falkland Islands (the) [Malvinas]
  fk: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Faroe Islands (the)
  fo: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Fiji
  fj: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Finland
  fi: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // France
  fr: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // French Guiana
  gf: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // French Polynesia
  pf: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // French Southern Territories (the)
  tf: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Gabon
  ga: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Gambia (the)
  gm: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Georgia
  ge: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Germany
  de: {
    ...PRODUCT,
    name: 'Vercel Becher',
    description: 'Limitierte Auflage, beschränkte Auflage',
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Ghana
  gh: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Gibraltar
  gi: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Greece
  gr: {
    ...PRODUCT,
    discount: REGIONS['3'].discount,
    link: `${STORE_URL}/cart/${REGIONS['3'].id}:1`,
  },
  // Greenland
  gl: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Grenada
  gd: {
    ...PRODUCT,
    discount: REGIONS['3'].discount,
    link: `${STORE_URL}/cart/${REGIONS['3'].id}:1`,
  },
  // Guadeloupe
  gp: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Guam
  gu: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Guatemala
  gt: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Guernsey
  gg: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Guinea
  gn: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Guinea-Bissau
  gw: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Guyana
  gy: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Haiti
  ht: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Heard Island and McDonald Islands
  hm: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Holy See (the)
  va: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Honduras
  hn: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Hong Kong
  hk: {
    ...PRODUCT,
    discount: REGIONS['3'].discount,
    link: `${STORE_URL}/cart/${REGIONS['3'].id}:1`,
  },
  // Hungary
  hu: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Iceland
  is: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // India
  in: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Indonesia
  id: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Iran (Islamic Republic of)
  ir: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Iraq
  iq: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Ireland
  ie: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Isle of Man
  im: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Israel
  il: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Italy
  it: {
    ...PRODUCT,
    discount: REGIONS['2'].discount,
    link: `${STORE_URL}/cart/${REGIONS['2'].id}:1`,
  },
  // Jamaica
  jm: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Japan
  jp: {
    ...PRODUCT,
    name: 'Vercel マグ',
    description: '限定版',
    discount: REGIONS['2'].discount,
    link: `${STORE_URL}/cart/${REGIONS['2'].id}:1`,
  },
  // Jersey
  je: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Jordan
  jo: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Kazakhstan
  kz: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Kenya
  ke: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Kiribati
  ki: {
    ...PRODUCT,
    discount: REGIONS['3'].discount,
    link: `${STORE_URL}/cart/${REGIONS['3'].id}:1`,
  },
  // Korea (the Democratic People's Republic of)
  kp: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Korea (the Republic of)
  kr: {
    ...PRODUCT,
    discount: REGIONS['3'].discount,
    link: `${STORE_URL}/cart/${REGIONS['3'].id}:1`,
  },
  // Kuwait
  kw: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Kyrgyzstan
  kg: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Lao People's Democratic Republic (the)
  la: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Latvia
  lv: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Lebanon
  lb: {
    ...PRODUCT,
    discount: REGIONS['4'].discount,
    link: `${STORE_URL}/cart/${REGIONS['4'].id}:1`,
  },
  // Lesotho
  ls: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Liberia
  lr: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Libya
  ly: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Liechtenstein
  li: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Lithuania
  lt: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Luxembourg
  lu: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Macao
  mo: {
    ...PRODUCT,
    discount: REGIONS['3'].discount,
    link: `${STORE_URL}/cart/${REGIONS['3'].id}:1`,
  },
  // Madagascar
  mg: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Malawi
  mw: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Malaysia
  my: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Maldives
  mv: {
    ...PRODUCT,
    discount: REGIONS['3'].discount,
    link: `${STORE_URL}/cart/${REGIONS['3'].id}:1`,
  },
  // Mali
  ml: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Malta
  mt: {
    ...PRODUCT,
    discount: REGIONS['3'].discount,
    link: `${STORE_URL}/cart/${REGIONS['3'].id}:1`,
  },
  // Marshall Islands (the)
  mh: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Martinique
  mq: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Mauritania
  mr: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Mauritius
  mu: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Mayotte
  yt: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Mexico
  mx: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Micronesia (Federated States of)
  fm: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Moldova (the Republic of)
  md: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Monaco
  mc: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Mongolia
  mn: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Montenegro
  me: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Montserrat
  ms: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Morocco
  ma: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Mozambique
  mz: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Myanmar
  mm: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Namibia
  na: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Nauru
  nr: {
    ...PRODUCT,
    discount: REGIONS['3'].discount,
    link: `${STORE_URL}/cart/${REGIONS['3'].id}:1`,
  },
  // Nepal
  np: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Netherlands (the)
  nl: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // New Caledonia
  nc: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // New Zealand
  nz: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Nicaragua
  ni: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Niger (the)
  ne: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Nigeria
  ng: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Niue
  nu: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Norfolk Island
  nf: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Northern Mariana Islands (the)
  mp: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Norway
  no: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Oman
  om: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Pakistan
  pk: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Palau
  pw: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Palestine, State of
  ps: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Panama
  pa: {
    ...PRODUCT,
    discount: REGIONS['4'].discount,
    link: `${STORE_URL}/cart/${REGIONS['4'].id}:1`,
  },
  // Papua New Guinea
  pg: {
    ...PRODUCT,
    discount: REGIONS['4'].discount,
    link: `${STORE_URL}/cart/${REGIONS['4'].id}:1`,
  },
  // Paraguay
  py: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Peru
  pe: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Philippines (the)
  ph: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Pitcairn
  pn: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Poland
  pl: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Portugal
  pt: {
    ...PRODUCT,
    discount: REGIONS['3'].discount,
    link: `${STORE_URL}/cart/${REGIONS['3'].id}:1`,
  },
  // Puerto Rico
  pr: {
    ...PRODUCT,
    discount: REGIONS['3'].discount,
    link: `${STORE_URL}/cart/${REGIONS['3'].id}:1`,
  },
  // Qatar
  qa: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Republic of North Macedonia
  mk: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Romania
  ro: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Russian Federation (the)
  ru: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Rwanda
  rw: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Réunion
  re: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Saint Barthélemy
  bl: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Saint Helena, Ascension and Tristan da Cunha
  sh: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Saint Kitts and Nevis
  kn: {
    ...PRODUCT,
    discount: REGIONS['4'].discount,
    link: `${STORE_URL}/cart/${REGIONS['4'].id}:1`,
  },
  // Saint Lucia
  lc: {
    ...PRODUCT,
    discount: REGIONS['3'].discount,
    link: `${STORE_URL}/cart/${REGIONS['3'].id}:1`,
  },
  // Saint Martin (French part)
  mf: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Saint Pierre and Miquelon
  pm: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Saint Vincent and the Grenadines
  vc: {
    ...PRODUCT,
    discount: REGIONS['4'].discount,
    link: `${STORE_URL}/cart/${REGIONS['4'].id}:1`,
  },
  // Samoa
  ws: {
    ...PRODUCT,
    discount: REGIONS['3'].discount,
    link: `${STORE_URL}/cart/${REGIONS['3'].id}:1`,
  },
  // San Marino
  sm: {
    ...PRODUCT,
    discount: REGIONS['3'].discount,
    link: `${STORE_URL}/cart/${REGIONS['3'].id}:1`,
  },
  // Sao Tome and Principe
  st: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Saudi Arabia
  sa: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Senegal
  sn: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Serbia
  rs: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Seychelles
  sc: {
    ...PRODUCT,
    discount: REGIONS['4'].discount,
    link: `${STORE_URL}/cart/${REGIONS['4'].id}:1`,
  },
  // Sierra Leone
  sl: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Singapore
  sg: {
    ...PRODUCT,
    discount: REGIONS['4'].discount,
    link: `${STORE_URL}/cart/${REGIONS['4'].id}:1`,
  },
  // Sint Maarten (Dutch part)
  sx: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Slovakia
  sk: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Slovenia
  si: {
    ...PRODUCT,
    discount: REGIONS['3'].discount,
    link: `${STORE_URL}/cart/${REGIONS['3'].id}:1`,
  },
  // Solomon Islands
  sb: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Somalia
  so: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // South Africa
  za: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // South Georgia and the South Sandwich Islands
  gs: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // South Sudan
  ss: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Spain
  es: {
    ...PRODUCT,
    discount: REGIONS['3'].discount,
    link: `${STORE_URL}/cart/${REGIONS['3'].id}:1`,
  },
  // Sri Lanka
  lk: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Sudan (the)
  sd: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Suriname
  sr: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Svalbard and Jan Mayen
  sj: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Sweden
  se: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Switzerland
  ch: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Syrian Arab Republic
  sy: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Taiwan (Province of China)
  tw: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Tajikistan
  tj: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Tanzania, United Republic of
  tz: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Thailand
  th: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Timor-Leste
  tl: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Togo
  tg: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Tokelau
  tk: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Tonga
  to: {
    ...PRODUCT,
    discount: REGIONS['3'].discount,
    link: `${STORE_URL}/cart/${REGIONS['3'].id}:1`,
  },
  // Trinidad and Tobago
  tt: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Tunisia
  tn: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Turkey
  tr: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Turkmenistan
  tm: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Turks and Caicos Islands (the)
  tc: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Tuvalu
  tv: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Uganda
  ug: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Ukraine
  ua: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // United Arab Emirates (the)
  ae: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // United Kingdom of Great Britain and Northern Ireland (the)
  gb: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // United States Minor Outlying Islands (the)
  um: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // United States of America (the)
  us: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Uruguay
  uy: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Uzbekistan
  uz: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Vanuatu
  vu: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Venezuela (Bolivarian Republic of)
  ve: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Viet Nam
  vn: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Virgin Islands (British)
  vg: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Virgin Islands (U.S.)
  vi: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Wallis and Futuna
  wf: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Western Sahara
  eh: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Yemen
  ye: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
  // Zambia
  zm: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Zimbabwe
  zw: {
    ...PRODUCT,
    discount: REGIONS['5'].discount,
    link: `${STORE_URL}/cart/${REGIONS['5'].id}:1`,
  },
  // Åland Islands
  ax: {
    ...PRODUCT,
    discount: REGIONS['1'].discount,
    link: `${STORE_URL}/cart/${REGIONS['1'].id}:1`,
  },
}

export default {
  product: {
    fetch: async ({
      country,
    }: { country?: Country } = {}): Promise<Product> => {
      let product = PRODUCT

      if (country && PRODUCTS[country]) {
        product = PRODUCTS[country]
      }

      let delay = DELAY
      if (country === 'jp') {
        delay = 1250
      }

      return new Promise((resolve) => setTimeout(() => resolve(product), delay))
    },
    countries: async (): Promise<Country[]> =>
      Object.keys(PRODUCTS) as Country[],
  },
}
