declare module '@react-navigation/native' {
  export const NavigationContainer: any;
  export function useNavigation<T = any>(): T;
  export function useRoute<T = any>(): T;
  export function useIsFocused(): boolean;
  export function useFocusEffect(callback: () => void | (() => void)): void;
  export const ThemeContext: any;
  export function useTheme(): any;
  export type NavigationProp<T = any> = any;
  export type RouteProp<T = any, K = any> = any;
}

declare module '@react-navigation/stack' {
  export function createStackNavigator<T = any>(): {
    Navigator: any;
    Screen: any;
    Group: any;
  };
  export type StackNavigationProp<T = any> = any;
  export type StackScreenProps<T = any, K = any> = any;
}

declare module '@react-navigation/bottom-tabs' {
  export function createBottomTabNavigator<T = any>(): {
    Navigator: any;
    Screen: any;
    Group: any;
  };
  export type BottomTabNavigationProp<T = any> = any;
  export type BottomTabScreenProps<T = any, K = any> = any;
}

declare module '@react-navigation/elements' {
  export const Header: any;
  export const HeaderBackButton: any;
  export const HeaderTitle: any;
  export const Assets: any;
}

declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.webp' {
  const value: any;
  export default value;
}

declare module '*.jpg' {
  const value: any;
  export default value;
}
