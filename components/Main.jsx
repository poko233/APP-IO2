import { Text, View } from "react-native";
import "../global.css";
import { Screen } from "./Screen";

export function Main() {
  return (
    <Screen>
        <View className="flex-1 items-center px-6">
        <View className="flex-1 justify-center max-w-[960px] mx-auto">
            <Text className="text-6xl font-bold">Hello World</Text>
            <Text className="text-4xl text-red-900">
            This is the first page of your app.
            </Text>
        </View>
        </View>
    </Screen>
    
  );
}
