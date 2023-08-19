import { extendTheme } from "native-base";

export const THEME = extendTheme({
  colors: {
    product: {
      'blue': '#364D9D',
      'blue/10': 'rgba(100,122,199,.10)',
      'blue-light': '#647AC7',
      'red-light': '#EE7979',
    },
    base: {
      'black/60': 'rgba(000,000,000,.6)',


      'gray-1': '#1A181B',
      'gray-2': '#3E3A40',
      'gray-3': '#5F5B62',
      'gray-4': '#9F9BA1',
      'gray-5': '#D9D8DA',
      'gray-6': '#EDECEE',
      'gray-7': '#F7F7F8',

      'green-4': '#10b981'
    }
  },
  fonts: {
    heading: 'Karla_700Bold',
    body: 'Karla_400Regular'
  },
  fontSizes: {
    mini: 10,
    xxs: 12,
    xs: 14,
    md: 16,
    lg: 20,
    xl: 24
  },
}) ;

export type CustomThemeType = typeof THEME;
