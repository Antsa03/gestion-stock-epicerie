import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { useTailwind } from "tailwind-rn";
import { Ionicons } from "@expo/vector-icons";

import CustomIcon from "./CustomIcon";

interface ActionButtonProps extends TouchableOpacityProps {
  title: string;
  handlePress: () => void;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  classname?: string;
  type?: "default" | "edit" | "delete";
  size?: "sm" | "lg" | "xl";
}

const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  handlePress,
  iconName,
  iconColor = "white",
  classname = "",
  type = "default",
  size = "lg",
  ...props
}) => {
  const tailwind = useTailwind();

  const typeClasses: Record<NonNullable<ActionButtonProps["type"]>, string> = {
    default: "bg-gray-100 text-gray-600",
    edit: "bg-blue-50 text-blue-500",
    delete: "bg-red-50 text-red-500",
  };

  const colorTextClasses: Record<
    NonNullable<ActionButtonProps["type"]>,
    string
  > = {
    default: "text-gray-600",
    edit: "text-blue-500 ml-1",
    delete: "text-red-500 ml-1",
  };

  const sizeClasses: Record<NonNullable<ActionButtonProps["size"]>, string> = {
    sm: "h-8 px-4",
    lg: "h-8 w-8 px-2",
    xl: "h-8 w-fit px-4",
  };

  const titleClasses: Record<NonNullable<ActionButtonProps["size"]>, string> = {
    sm: "text-xs",
    lg: "text-sm",
    xl: "text-xs",
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`rounded-lg ${typeClasses[type]} ${sizeClasses[size]} flex flex-row justify-center items-center ${classname}`}
      {...props}
    >
      <CustomIcon name={iconName} color={iconColor} size={16} />
      <Text
        className={`font-pregular tracking-wide ${titleClasses[size]} ${colorTextClasses[type]}`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default ActionButton;
