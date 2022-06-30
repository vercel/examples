import { Dictionary } from './types'

export const DICTIONARIES: Record<string, Dictionary> = {
  default: {
    title: 'i18n Example',
    greet:
      'Hello!, we could not detect your locale so we defaulted to english.',
    subtitle: 'Localized text based on geolocation headers',
    link: 'See headers documentation',
  },
  en: {
    title: 'i18n Example',
    greet: 'Hello!',
    subtitle: 'Localized text based on geolocation headers',
    link: 'See headers documentation',
  },
  es: {
    title: 'Ejemplo de i18n',
    greet: '¡Hola!',
    subtitle: 'Texto localizado basado en las cabeceras de geolocalización',
    link: 'Ver la documentación de las cabeceras',
  },
  fr: {
    title: 'Exemple i18n',
    greet: 'Bonjour!',
    subtitle: 'Texte localisé basé sur les en-têtes de géolocalisation',
    link: 'Voir la documentation des en-têtes',
  },
  cn: {
    title: 'i18n 示例',
    greet: '你好!',
    subtitle: '基于地理位置标题的本地化文本',
    link: '请参阅标题文档',
  },
}
