import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BonEntree from "@/types/entree.type";
import ActionButton from "@/components/ActionButton";
import EditFormBonEntree from "./custom/EditFormEntree";

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

interface CardEntreeProps {
  bon_entree: BonEntree;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

const CardEntree: React.FC<CardEntreeProps> = ({
  bon_entree,
  onDelete,
  isDeleting,
}) => {
  const index = (bon_entree.id_bon_entree - 1) % 5;
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
          <Text className="text-lg text-center tracking-wide font-pregular ">
            {"Date d'entrée: " +
              new Date(
                bon_entree.date_entree ? bon_entree.date_entree : ""
              ).toLocaleDateString()}
          </Text>

          {/* <Text className="font-pbold text-center">Détails de l'entrée :</Text> */}

          {/* Each product */}
          {bon_entree.entrees.map((entree) => (
            <View
              key={entree.id_entree}
              className=" p-2  border-b border-slate-300 rounded-md mb-4"
            >
              <View className="flex flex-row justify-between items-center">
                <Text className="text-black-200">
                  {entree.produit?.designation || "N/A"}{" "}
                  <Text className="text-xs italic">
                    {" "}
                    ( PU : {entree.produit?.pu || "N/A"} Ar ) :
                  </Text>{" "}
                </Text>
                <Text className="text-custom-green font-pmedium">
                  {"" + entree.qte_entree} art(s)
                </Text>
              </View>
              <View className="flex flex-row justify-between items-center">
                <Text className="">{"Date de production: "}</Text>
                <Text className="font-pmedium">
                  {entree.lot?.date_production
                    ? new Date(entree.lot.date_production).toLocaleDateString()
                    : "N/A"}
                </Text>
              </View>
              <View className="flex flex-row justify-between items-center">
                <Text className="">{"Date de péremption: "}</Text>
                <Text className="text-red-400 font-psemibold">
                  {entree.lot?.date_peremption
                    ? new Date(entree.lot.date_peremption).toLocaleDateString()
                    : "N/A"}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View className="flex flex-row justify-between">
          <EditFormBonEntree bon_entree={bon_entree} />
          <ActionButton
            title="Supprimer"
            iconName="trash"
            handlePress={() => onDelete(bon_entree.id_bon_entree)}
            type="delete"
            size="xl"
            iconColor="#ef4444"
          />
        </View>
      </View>
    </View>
  );
};

export default CardEntree;
