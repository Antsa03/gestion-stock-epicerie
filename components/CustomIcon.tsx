import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { View } from "react-native";
import { useTailwind } from "tailwind-rn";

interface CustomIconProps {
  name: React.ComponentProps<typeof Ionicons>["name"];
  size?: number;
  classname?: string;
  color?: string;
}

const CustomIcon: React.FC<CustomIconProps> = ({
  name,
  size = 24,
  classname,
  color = "black",
}) => {
  const tailwind = useTailwind();

  return (
    <View
      style={[
        tailwind("justify-center items-center"),
        classname ? tailwind(classname) : null,
      ]}
    >
      <Ionicons name={name} size={size} color={color} />
    </View>
  );
};

export default CustomIcon;
