import React from "react";
import { View, Text, ActivityIndicator, Image } from "react-native";
import { useTailwind } from "tailwind-rn";

interface LoadingStateProps {
  message?: string;
  image?: any;
  showImage?: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Chargement en cours...",
  image,
  showImage = true,
}) => {
  const tailwind = useTailwind();

  return (
    <View className="flex-1 justify-center items-center px-4">
      {showImage && image && (
        <Image
          source={image}
          resizeMode="contain"
          className="w-[270px] h-[216px]"
        />
      )}
      <ActivityIndicator size="large" color="#00ff00" />
      {message && (
        <Text className="text-lg font-psemibold text-white mt-4">
          {message}
        </Text>
      )}
    </View>
  );
};

export default LoadingState;
