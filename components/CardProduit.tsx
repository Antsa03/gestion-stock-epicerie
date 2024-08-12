import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProduitType from "@/types/produit.type";
import ProduitFormEdit from "./custom/ProduitFormEdit";
import ActionButton from "./ActionButton";
import EditFormProduit from "./custom/EditFormProduit";

const iconList: (keyof typeof Ionicons.glyphMap)[] = [
  "nutrition",
  "pizza",
  "wine",
  "cafe",
  "water",
];

// const colorList: string[] = [
//   "#FF6B6B", // Red
//   "#4ECDC4", // Teal
//   "#45B7D1", // Blue
//   "#FFA07A", // Light Salmon
//   "#98D8C8", // Mint
// ];

const colorList: string[] = [
  "#e2e8f0", // Red
  "#e2e8f0", // Teal
  "#e2e8f0", // Blue
  "#e2e8f0", // Light Salmon
  "#e2e8f0", // Mint
];

interface ProductCardProps {
  produit: ProduitType;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

const CardProduit: React.FC<ProductCardProps> = ({
  produit,
  onDelete,
  isDeleting,
}) => {
  const index = (produit.id_produit - 1) % 5;
  const iconName = iconList[index];
  const iconColor = colorList[index];

  // Determine the stock color
  const stockColor = produit.stock < 10 ? "text-red-500 " : "text-green-500";

  return (
    <View className="relative  bg-white pr-4 pl-6 py-3 rounded-xl flex-row items-center overflow-hidden">
      <View
        className={`absolute top-1.5 left-1.5 rounded-full items-center justify-center mr-4`}
      >
        <Ionicons name={iconName} size={16} color={iconColor} />
      </View>
      <View className="flex-1 mr-10">
        <Text className="text-lg tracking-wide font-pregular">
          {produit.designation}
        </Text>
        <View className="w-full flex-row items-center justify-between">
          <View>
            <Text className={`text-sm font-psemibold  ${stockColor}`}>
              {produit.stock} en stock
            </Text>
          </View>

          <View>
            <Text className={`text-base font-psemibold`}>/</Text>
          </View>

          <View>
            <Text className="text-sm text-custom-gray font-psemibold">
              PU : {produit.pu} Ar
            </Text>
          </View>
        </View>
      </View>

      <View className="flex space-y-2">
        <EditFormProduit produit={produit} />
        <ActionButton
          title=""
          iconName="trash"
          handlePress={() => onDelete(produit.id_produit)}
          type="delete"
          size="lg"
          iconColor="#ef4444"
        />
      </View>
    </View>
  );
};

export default CardProduit;
