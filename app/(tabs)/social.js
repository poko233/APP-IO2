import React from "react";
import { View, ScrollView, Text } from "react-native";
import SocialLink from "../../components/SocialLink";
import SocialCarousel from "../../components/SocialCarousel";
import { FontAwesome } from "@expo/vector-icons";

export default function SocialScreen() {
  const redes = [
    {
      key: "instagram",
      title: "Instagram",
      icon: <FontAwesome name="instagram" size={24} color="#E1306C" />,
      url: "https://www.instagram.com/victortc.exe",
      posts: [
        { source: "https://img.freepik.com/foto-gratis/saludable-surtido-frutas-secas-pastillas-chupar_7502-8491.jpg?semt=ais_hybrid&w=740" },
        { source: "https://img.freepik.com/fotos-premium/pastilla-baya-malvavisco-frutas-sobre-fondo-claro_157947-2829.jpg" },
        { source: "https://img.freepik.com/fotos-premium/pastilla-frutas-diferentes-sabores-chips-frutas-o-rodajas-frutos-secos-caja-regalo_158155-2077.jpg" },
      ],
    },
    {
      key: "tiktok",
      title: "TikTok",
      image: 'https://w7.pngwing.com/pngs/190/385/png-transparent-tik-tok-thumbnail.png',
      url: "https://www.tiktok.com/@tu_usuario",
      posts: [
        { source: "https://img.freepik.com/foto-gratis/saludable-surtido-frutas-secas-pastillas-chupar_7502-8491.jpg?semt=ais_hybrid&w=740" },
        { source: "https://img.freepik.com/fotos-premium/pastilla-baya-malvavisco-frutas-sobre-fondo-claro_157947-2829.jpg" },
        { source: "https://img.freepik.com/fotos-premium/pastilla-frutas-diferentes-sabores-chips-frutas-o-rodajas-frutos-secos-caja-regalo_158155-2077.jpg" },
      ],
    },
    // ... otras redes
  ];

   return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold text-center mb-6">
        Síguenos y descubre
      </Text>

      {redes.map(r => (
        <View key={r.key} className="mb-8">
          <SocialCarousel data={r.posts} />
          <SocialLink
            title={r.title}
            iconSource={r.icon}
            url={r.url}
          />
        </View>
      ))}
    </ScrollView>
  );
}
