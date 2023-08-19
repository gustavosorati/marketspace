import { CustomThemeType } from "../styles/theme";

declare module 'native-base' {
  interface ICustomTheme extends CustomThemeType {}
}