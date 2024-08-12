import React from "react";
import { Picker } from "@react-native-picker/picker";
import { Controller } from "react-hook-form";

interface CustomPickerProps {
  control: any;
  name: string;
  options: { label: string; value: string }[];
  onValueChange: (value: string) => void;
  selectedValue: string;
}

const CustomPicker: React.FC<CustomPickerProps> = ({
  control,
  name,
  options,
  onValueChange,
  selectedValue,
}) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onChange, onBlur, value } }) => (
      <Picker
        selectedValue={value}
        onValueChange={(itemValue) => {
          onChange(itemValue); // Update react-hook-form value
          onValueChange(itemValue); // Additional handler if needed
        }}
      >
        {options.map((option) => (
          <Picker.Item
            key={option.value}
            label={option.label}
            value={option.value}
            style={{
              borderColor: "red",
              borderWidth: 2,
              height: 56,
            }}
          />
        ))}
      </Picker>
    )}
  />
);

export default CustomPicker;
