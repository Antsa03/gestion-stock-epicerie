import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Produit from "@/types/produit.type";

type StockAlertListProps = {
  produits: Produit[];
};

const StockAlertList: React.FC<StockAlertListProps> = ({ produits }) => {
  return (
    <View className="w-full  mt-4 rounded-3xl ">
      <Text className="text-lg font-pmedium text-custom-black pl-1 mb-2">
        Alerte stock faible{" ( < 10)"}
      </Text>

      <ScrollView horizontal className="flex flex-row space-x-4  rounded-3xl">
        {produits.map((produit) => (
          <View
            key={produit.id_produit}
            className="relative py-3 pl-4 pr-6 rounded-xl  border border-red-400 bg-red-50/60"
          >
            <Text className="text-sm font-pmedium text-black">
              {produit.designation}
            </Text>

            <View className="flex flex-row justify-between">
              {/* <Text className="text-xs text-gray-700">
                PU:
                <Text className="text-sm font-pmedium">
                  {produit.pu.toLocaleString()} Ar
                </Text>
              </Text> */}

              <Text className="text-xs text-red-600">
                <Text className="text-sm font-pmedium">{produit.stock}</Text> en
                stock
              </Text>
            </View>

            <View className="absolute right-1 top-1">
              <Ionicons name="alert-circle-outline" size={14} color="#E53E3E" />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default StockAlertList;
