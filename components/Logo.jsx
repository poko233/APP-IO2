import { Image } from "react-native";
import "../global.css"; 

export const Logo = () => {
  return (
    <Image
      source={require("../assets/logo.png")}
      style={{ width: 70, height: 70 }}
      resizeMode="contain"
      className="padding-2"
    />
  );
};
