import { View } from "react-native";

export function Screen({ children }) {
  return <View className="flex-1 bg-white pt-4 px-2">{children}</View>;
}
