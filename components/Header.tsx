import React from "react";
import { View, Text } from "react-native";

const Header: React.FC<{ title: string }> = ({ title }) => {
  return (
    <View className="bg-white h-24 px-4 justify-center  border-b border-gray-200">
      <Text className="text-custom-green font-pmedium text-xl mt-10">
        {title}
      </Text>
    </View>
  );
};

export default Header;
