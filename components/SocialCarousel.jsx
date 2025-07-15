// components/SocialCarousel.jsx
import React, { useRef, useEffect, useState } from "react";
import { View, FlatList, Image, Dimensions } from "react-native";
import { MotiView } from "moti";
import { Easing } from 'react-native-reanimated';

const { width } = Dimensions.get("window");

// Tamaños y espacios
const ITEM_WIDTH         = width - (16 * 2) - 16;  // ancho total menos padding y margen extra
const ITEM_SPACING       = 24;                     // hueco entre slides
const PARENT_H_PAD       = 16 * 2;                 // p-4 en el ScrollView padre → 16px cada lado
// Calculamos el espacio lateral para centrar perfectamente
const SIDE_SPACING       = 8;                      // espacio lateral mínimo

export default function SocialCarousel({ data = [] }) {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Loop automático con delays variables
  useEffect(() => {
    if (!data.length) return;
    let timeoutId;

    const runLoop = () => {
      const next = (currentIndex + 1) % data.length;
      flatListRef.current?.scrollToOffset({
        offset: next * (ITEM_WIDTH + ITEM_SPACING),
        animated: true,
      });
      setCurrentIndex(next);
      // Delay de 5s al volver a 0, 3s en los demás
      timeoutId = setTimeout(runLoop, next === 0 ? 5000 : 3000);
    };

    timeoutId = setTimeout(runLoop, 2000);
    return () => clearTimeout(timeoutId);
  }, [currentIndex, data.length]);

  const renderItem = ({ item, index }) => (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        delay: 200 + index * 100,
        type: "timing",
        duration: 800,
        easing: Easing.out(Easing.cubic)
      }}
      style={{
        width: ITEM_WIDTH,
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <Image
        source={{ uri: item.source }}
        style={{ width: "100%", height: 180 }}
        resizeMode="cover"
      />
    </MotiView>
  );

  return (
    <View style={{ paddingVertical: 16, paddingHorizontal: 8 }}>
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(_, i) => i.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={ITEM_WIDTH + ITEM_SPACING}
        snapToAlignment="start"
        onMomentumScrollEnd={(e) => {
          const offsetX = e.nativeEvent.contentOffset.x;
          const idx = Math.round(offsetX / (ITEM_WIDTH + ITEM_SPACING));
          setCurrentIndex(idx);
        }}
        // Centramos con header/footer
        ListHeaderComponent={<View style={{ width: SIDE_SPACING }} />}
        ListFooterComponent={<View style={{ width: SIDE_SPACING }} />}
        ItemSeparatorComponent={() => <View style={{ width: ITEM_SPACING }} />}
        contentContainerStyle={{ alignItems: "center" }}
        renderItem={renderItem}
      />
    </View>
  );
}