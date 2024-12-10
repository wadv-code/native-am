/**
 * 字符串类型对象
 */
type Recordable<T> = Record<string, T>;

/**
 *  T | null 包装
 */
type Nullable<T> = null | T;

/**
 * T | Not null 包装
 */
type NonNullable<T> = T extends null | undefined ? never : T;

// interface DeclareTheme extends Theme {
//   dark: boolean;
//   colors: {
//     primary: string;
//     background: string;
//     card: string;
//     text: string;
//     border: string;
//     notification: string;
//     primary: string;
//     background: string;
//     card: string;
//     text: string;
//     border: string;
//     notification: string;
//     danger: string;
//     success: string;
//     warning: string;
//     pink: string;
//     purple: string;
//     deepPurple: string;
//     indigo: string;
//     blue: string;
//     lightBlue: string;
//     cyan: string;
//     teal: string;
//     lightGreen: string;
//     lime: string;
//     yellow: string;
//     amber: string;
//     deepOrange: string;
//     brown: string;
//     blueGrey: string;
//     grey: string;
//     color: string;
//     backgroundPrimary: string;
//     tint: string;
//     icon: string;
//     tabIconDefault: string;
//     tabIconSelected: string;
//     shadowColor: string;
//   };
//   fonts: {
//     regular: FontStyle;
//     medium: FontStyle;
//     bold: FontStyle;
//     heavy: FontStyle;
//   };
// }

// declare global {
//   // eslint-disable-next-line @typescript-eslint/no-namespace
//   namespace ReactNavigation {
//     // eslint-disable-next-line @typescript-eslint/no-empty-interface
//     interface RootParamList {}

//     // eslint-disable-next-line @typescript-eslint/no-empty-interface
//     interface Theme {
//     }
//   }
// }

// type ThemeColor = DeclareTheme;

// declare global {
//   namespace ReactNavigation {
//     // 扩展已有的 Theme 接口
//     interface ThemeColor extends Theme {
//       dark: boolean;
//       colors: {
//         // primary: string;
//         // background: string;
//         // card: string;
//         // text: string;
//         // border: string;
//         // notification: string;
//         // primary: string;
//         // background: string;
//         // card: string;
//         // text: string;
//         // border: string;
//         // notification: string;
//         danger: string;
//         success: string;
//         warning: string;
//         pink: string;
//         purple: string;
//         deepPurple: string;
//         indigo: string;
//         blue: string;
//         lightBlue: string;
//         cyan: string;
//         teal: string;
//         lightGreen: string;
//         lime: string;
//         yellow: string;
//         amber: string;
//         deepOrange: string;
//         brown: string;
//         blueGrey: string;
//         grey: string;
//         color: string;
//         backgroundPrimary: string;
//         tint: string;
//         icon: string;
//         tabIconDefault: string;
//         tabIconSelected: string;
//         shadowColor: string;
//       };
//     }
//   }
// }
