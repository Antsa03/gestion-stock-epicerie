import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { useTailwind } from "tailwind-rn";
import CustomIcon from "./CustomIcon";

interface PlusButtonProps extends TouchableOpacityProps {
  title: string;
  handlePress: () => void;
  classname?: string;
  type?: "primary" | "secondary";
  size?: "sm" | "lg" | "xl";
}

const ModifierButton: React.FC<PlusButtonProps> = ({
  title,
  handlePress,
  classname = "",
  type = "primary",
  size = "lg",
  ...props
}) => {
  const tailwind = useTailwind();

  const typeClasses: {
    [key in NonNullable<PlusButtonProps["type"]>]: string;
  } = {
    primary: "bg-custom-green/90 rounded-md text-white border-blue-500",
    secondary: "bg-blue-500 text-white border-gray-500",
  };

  const sizeClasses: {
    [key in NonNullable<PlusButtonProps["size"]>]: string;
  } = {
    sm: "h-8 px-4",
    lg: "h-12 pl-2 pr-4 space-x-1",
    xl: "h-14 ",
  };

  const titleClasses: {
    [key in NonNullable<PlusButtonProps["size"]>]: string;
  } = {
    sm: "",
    lg: "text-white  text-base",
    xl: "",
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`${typeClasses[type]} ${sizeClasses[size]} inset-2 w-fit flex flex-row justify-center items-center`}
      {...props}
    >
      <CustomIcon name="add" color="white" size={20} />
      <Text className={`font-pregular tracking-wide  ${titleClasses[size]}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default ModifierButton;
