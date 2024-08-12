import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTailwind } from "tailwind-rn";

interface CustomDatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  containerStyles?: string;
  textStyles?: string;
  error?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  containerStyles = "",
  textStyles = "",
  error = "",
}) => {
  const [show, setShow] = useState(false);
  const tailwind = useTailwind();

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    setShow(false);
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => setShow(true)}
      className={`border h-12 px-2 rounded-md flex items-start justify-center ${
        error ? "border-red-500" : "border-gray-500"
      }`}
    >
      <Text className={`text-black  ${textStyles}`}>
        {value ? value.toDateString() : "Selectionnez une date"}
      </Text>

      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      {error && <Text className="text-red-500">{error}</Text>}
    </TouchableOpacity>
  );
};

export default CustomDatePicker;
