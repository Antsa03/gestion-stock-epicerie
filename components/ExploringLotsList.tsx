import React from "react";
import { View, Text, ScrollView } from "react-native";
import Lot from "@/types/lot.type";
import { Ionicons } from "@expo/vector-icons";

type ExpiringLotsListProps = {
  lots: Lot[];
  dateLimite: Date;
};

const ExpiringLotsList: React.FC<ExpiringLotsListProps> = ({
  lots,
  dateLimite,
}) => {
  return (
    <View className="w-full  mt-4 rounded-3xl ">
      <Text className="text-lg font-pmedium text-custom-black pl-1 mb-2">
        Lots périmés dans les 7 jours
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {lots.map((lot) => (
          <View
            key={lot.id_lot}
            className="relative py-3 pl-4 pr-5 mr-4  border bg-orange-50/50 border-orange-300 rounded-2xl"
          >
            <Text className="text-sm font-pmedium text-black">
              Lot ID: {lot.id_lot}
            </Text>

            <Text className="text-sm  text-black-100">
              {lot.produit?.designation} /
              <Text className="text-sm text-black-100">
                Quantité: {lot.quantite_lot}
              </Text>
            </Text>
            <Text className="text-sm text-orange-600">
              Date de péremption :{" "}
              <Text className="text-sm  font-pmedium">
                {new Date(lot.date_peremption).toLocaleDateString()}
              </Text>
            </Text>

            <View className="absolute right-1.5 top-1.5">
              <Ionicons name="time-outline" size={20} color="#fdba74" />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default ExpiringLotsList;
