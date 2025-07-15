import { Image } from "react-native";
import "../global.css"; 

export const Logo = () => {
  return (
    <Image
      source={require("../assets/favicon.png")}
      style={{ width: 40, height: 40 }}
      resizeMode="contain"
      className="padding-2"
    />
  );
};
