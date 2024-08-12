import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BonSortie from "@/types/sortie.type";
import BonSortieFormEdit from "@/components/custom/SortieFormEdit";
import ActionButton from "@/components/ActionButton";
import EditFormSortie from "./custom/EditFormSortie";

const iconList: (keyof typeof Ionicons.glyphMap)[] = [
  "nutrition",
  "pizza",
  "wine",
  "cafe",
  "water",
];

const colorList: string[] = [
  "#e2e8f0", // Light Gray
  "#e2e8f0", // Light Gray
  "#e2e8f0", // Light Gray
  "#e2e8f0", // Light Gray
  "#e2e8f0", // Light Gray
];

interface CardSortiesProps {
  bon_sortie: BonSortie;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

const CardSortie: React.FC<CardSortiesProps> = ({
  bon_sortie,
  onDelete,
  isDeleting,
}) => {
  const index = (bon_sortie.id_bon_sortie - 1) % 5;
  const iconName = iconList[index];
  const iconColor = colorList[index];

  return (
    <View className="relative bg-white px-4 py-4 rounded-xl flex-row items-center overflow-hidden my-2">
      {/* Illustration left */}
      <View className="absolute top-1.5 left-1.5 rounded-full items-center justify-center mr-4">
        <Ionicons name={iconName} size={16} color={iconColor} />
      </View>

      {/* Container */}
      <View className="flex-1">
        <View className="flex-1">
          <Text className="text-lg text-center tracking-wide font-pregular">
            {"Date de sortie: " +
              new Date(
                bon_sortie.date_sortie ? bon_sortie.date_sortie : ""
              ).toLocaleDateString()}
          </Text>

          {/* Each product */}
          {bon_sortie.sorties.map((sortie) => {
            // Calculate total value for each sortie
            let totalValue = 0;
            if (sortie.produit)
              totalValue = sortie.qte_sortie * sortie.produit.pu;

            return (
              <View
                key={sortie.id_sortie}
                className="p-2 border-b border-slate-300 rounded-md mb-4"
              >
                <View className="flex flex-row justify-between items-center">
                  <Text className="text-black-200">
                    {sortie.produit?.designation}{" "}
                    <Text className="text-xs italic">
                      {" "}
                      ( PU : {sortie.produit?.pu} Ar ) :
                    </Text>{" "}
                  </Text>
                  <Text className="text-custom-red font-pmedium text-custom-green">
                    {"" + sortie.qte_sortie} art(s)
                  </Text>
                </View>

                <View className="flex flex-row justify-between items-center">
                  <Text>{"Type de sortie: " + sortie.type_sortie}</Text>
                  <Text>{sortie.type_sortie}</Text>
                </View>

                <View className="flex flex-row justify-between items-center">
                  <Text className="text-custom-red">Total:</Text>
                  <Text>{totalValue} Ar</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View className="flex flex-row justify-between">
          <EditFormSortie bon_sortie={bon_sortie} />
          <ActionButton
            title="Supprimer"
            iconName="trash"
            handlePress={() => onDelete(bon_sortie.id_bon_sortie)}
            type="delete"
            size="xl"
            iconColor="#ef4444"
          />
        </View>
      </View>
    </View>
  );
};

export default CardSortie;
