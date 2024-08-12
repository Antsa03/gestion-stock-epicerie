import React from "react";
import { View, Text } from "react-native";

type DashboardCardProps = {
  title: string;
  value: string;
};

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value }) => {
  return (
    <View className="w-1/2 p-2">
      <View className="relative p-4 rounded-xl bg-white  border border-slate-300 space-y-2">
        <View className="absolute h-[3px]  w-1/3 bg-custom-green top-4 left-4 rounded-full" />
        <Text className="text-base font-semibold text-custom-gray">
          {title}
        </Text>
        <Text className="text-xl font-bold text-black">{value}</Text>
      </View>
    </View>
  );
};

export default DashboardCard;
