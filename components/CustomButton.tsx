import React from "react";
import {
  ActivityIndicator,
  GestureResponderEvent,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { useTailwind } from "tailwind-rn";

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  handlePress: ((event: GestureResponderEvent) => void) | undefined;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
  type?: "primary" | "secondary";
  size?: "sm" | "lg" | "xl";
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  handlePress,
  containerStyles = "",
  textStyles = "",
  isLoading = false,
  type = "primary",
  size = "lg",
  ...props
}) => {
  const tailwind = useTailwind();

  const typeClasses: {
    [key in NonNullable<CustomButtonProps["type"]>]: string;
  } = {
    primary: "bg-custom-green text-white border-blue-500",
    secondary: "bg-blue-500 text-white border-gray-500",
  };

  const sizeClasses: {
    [key in NonNullable<CustomButtonProps["size"]>]: string;
  } = {
    sm: "h-8 px-4 text-sm",
    lg: "h-12 px-6 text-lg",
    xl: "h-16 px-8 text-xl",
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`${typeClasses[type]} ${
        sizeClasses[size]
      } flex flex-row justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={isLoading}
      {...props}
    >
      {isLoading === true ? (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          style={tailwind("")}
        />
      ) : (
        <Text className={`font-pmedium tracking-wide ${textStyles}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
