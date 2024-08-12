import React from "react";
import { View, Text } from "react-native";

type DashboardCardProps = {
  title: string;
  value: string;
};

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value }) => {
  return (
    // <View className="w-56 flex flex-row px-6 py-2 items-center bg-white border border-slate-800 rounded-full shadow-sm">
    //   <Text className="text-sm text-black-100">{title} : </Text>
    //   <Text className="text-base font-psemibold text-black-100">{value}</Text>
    // </View>

    <View className=" flex flex-row items-center pl-1">
      <Text className="text-lg font-pmedium text-custom-black">{title} :</Text>

      <View className="bg-green-50 rounded-xl py-2 px-4 ml-2">
        <Text className="text-base font-psemibold text-custom-green">
          {value}
        </Text>
      </View>
    </View>
  );
};

export default DashboardCard;
