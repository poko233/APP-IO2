import { Link } from "expo-router";
import { View, ScrollView, Text, Pressable, Linking } from "react-native";
import SocialLink from "../../components/SocialLink";
import SocialCarousel from "../../components/SocialCarousel";
import { FontAwesome } from "@expo/vector-icons";

export default function SocialScreen() {
  const redes = [
    {
      key: "instagram",
      title: "Instagram",
      icon: <FontAwesome name="instagram" size={24} color="#black" />,
      url: "https://www.instagram.com/1deli.frut1",
      posts: [
        {
          source:
            "https://i.ibb.co/cKNFkvQJ/IG.png",
        },
        {
          source:
            "https://i.ibb.co/21CN864Y/image.png",
        },
        {
          source:
            "https://i.ibb.co/HpGpDWvg/image.png",
        },
      ],
    },
    {
      key: "tiktok",
      title: "TikTok",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Tiktok_icon.svg/1200px-Tiktok_icon.svg.png",
      url: "https://www.tiktok.com/@delifrut57",
      posts: [
        {
          source:
            "https://i.ibb.co/XrxJQGjL/TK.png",
        },
        {
          source:
            "https://i.ibb.co/Rk16hjZ5/image.png",
        },
        {
          source:
            "https://i.ibb.co/x8wKS78W/image.png",
        },
      ],
    },
    {
      key: "facebook",
      title: "Facebook",
      icon: <FontAwesome name="facebook-f" size={24} color="black" />,
      url: "https://www.facebook.com/share/1BNWEvFxFf/",
      posts: [
        {
          source:
            "https://i.ibb.co/9mGfVdkn/FB.png",
        },
        {
          source:
            "https://i.ibb.co/HpGpDWvg/image.png",
        },
        {
          source:
            "https://img.freepik.com/fotos-premium/pastilla-frutas-diferentes-sabores-chips-frutas-o-rodajas-frutos-secos-caja-regalo_158155-2077.jpg",
        },
      ],
    },
  ];

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-center mb-6">
        Síguenos y descubre
      </Text>

      {redes.map((r) => (
        <View key={r.key} className="mb-8">
          <Pressable onPress={() => Linking.openURL(r.url)}>
            <SocialCarousel data={r.posts} />
          </Pressable>
          <SocialLink
            title={r.title}
            iconSource={r.icon}
            imageSource={r.image ? { uri: r.image } : undefined}
            url={r.url}
          />
        </View>
      ))}
    </ScrollView>
  );
}
