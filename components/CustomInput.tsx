import React from "react";
import { TextInput, View, Text } from "react-native";
import { Controller } from "react-hook-form";

interface CustomInputProps {
  control: any;
  name: string;
  placeholder: string;
  keyboardType?: "default" | "numeric";
  rules?: any; // Add validation rules
  error?: string; // Prop to pass the error message
  type?: "text" | "numeric";
}

const CustomInput: React.FC<CustomInputProps> = ({
  control,
  name,
  placeholder,
  keyboardType = "default",
  rules,
  error,
  type = "text",
}) => (
  <View className="relative">
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          className="border p-2 rounded-md w-full"
          placeholder={placeholder}
          keyboardType={keyboardType}
          onBlur={onBlur}
          onChangeText={(text) => {
            if (type === "numeric") {
              const numericValue = text.replace(/[^0-9.]/g, "");
              onChange(numericValue === "" ? "" : parseFloat(numericValue));
            } else {
              onChange(text);
            }
          }}
          value={
            type === "numeric" && value !== null && value !== undefined
              ? value.toLocaleString()
              : value
          }
        />
      )}
    />
    {error && typeof error === "string" && (
      <Text className="text-red-500 mt-1">{error}</Text>
    )}

    {name === "pu" && (
      <Text className="absolute text-custom-black text-base font-psemibold right-4 top-3">
        Ar
      </Text>
    )}
  </View>
);

export default CustomInput;
