import React from "react";
import { View, Text, Image, ImageSourcePropType } from "react-native";
import CustomButton from "./CustomButton";

interface EmptyStateProps {
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
  buttonText?: string;
  onButtonPress?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  image,
  buttonText = "Back to Explore",
  onButtonPress,
}) => {
  return (
    <View className="flex justify-center items-center px-4">
      <Image
        source={image}
        resizeMode="contain"
        className="w-[270px] h-[216px]"
      />
      <Text className="text-sm font-pmedium text-gray-100">{title}</Text>
      <Text className="text-xl text-center font-psemibold text-black mt-2">
        {subtitle}
      </Text>
      {onButtonPress && (
        <CustomButton
          title={buttonText}
          handlePress={onButtonPress}
          containerStyles="w-full my-5"
        />
      )}
    </View>
  );
};

export default EmptyState;
