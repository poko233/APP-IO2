import React from 'react';
import { Pressable, View, Text, Image, Linking } from 'react-native';

export default function SocialLink({ title, iconSource, imageSource, url }) {
  const handlePress = () => {
    if (url) Linking.openURL(url);
  };

  return (
    <Pressable
      onPress={handlePress}
      className="w-full flex-row items-center bg-gray-100 rounded-lg p-4 mb-4"
    >
      {iconSource && (
        <View className="w-10 h-10 mr-4 justify-center items-center">
          {/** iconSource puede ser un componente <FontAwesome name="..." /> */}
          {iconSource}
        </View>
      )}
      {imageSource && (
        <Image
          source={imageSource}
          className="w-8 h-8 mr-4 rounded-full"
          resizeMode="contain"
        />
      )}
      <Text className="text-lg font-medium text-gray-800 flex-1">
        {title}
      </Text>
    </Pressable>
  );
}
