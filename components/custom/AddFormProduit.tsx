import { useQueryClient } from "@tanstack/react-query";
import Produit from "@/types/produit.type";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import PlusButton from "../PlusButton";
import CustomButton from "../CustomButton";
import CustomInput from "../CustomInput";
import CustomIcon from "../CustomIcon";
import ProduitService from "@/services/produit.service";

const AddFormProduit: React.FC = () => {
  //Récupération de l'instance de la base de données
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Produit>({
    mode: "all",
    defaultValues: {
      id_produit: undefined,
      designation: "",
      pu: 0,
      stock: 0,
    },
  });

  const queryClient = useQueryClient();

  //Logique de l'ajout
  const { createProduit } = ProduitService();

  const onSubmit: SubmitHandler<Produit> = (data) => {
    createProduit(data, () => {
      queryClient.invalidateQueries({ queryKey: ["produits"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["lots"] });
      reset();
      setModalVisibility(false);
    });
  };

  // Modal logic
  const [isModalVisible, setModalVisibility] = useState(false);

  return (
    <View className="relative bg-gray-100">
      <PlusButton handlePress={() => setModalVisibility(true)} title="Plus" />

      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black/50 p-4">
          <View className="relative w-full max-w-lg bg-white p-6 rounded-3xl ">
            <TouchableOpacity
              onPress={() => {
                setModalVisibility(false);
                reset();
              }}
              className="absolute right-1 top-1 p-2 z-20"
            >
              <View className="p-2 bg-red-50 rounded-full">
                <CustomIcon name="close" color="#DC2626" size={24} />
              </View>
            </TouchableOpacity>

            <Text className="text-xl font-psemibold text-custom-black mb-6">
              Ajouter un produit
            </Text>

            <View className="mb-4">
              <Text className="mb-2 text-gray-700">Désignation :</Text>
              <CustomInput
                control={control}
                name="designation"
                placeholder="Ex: 100"
                keyboardType="default"
                rules={{ required: "Désignation est requise" }}
                error={errors.designation?.message}
              />
            </View>

            <View className="mb-4">
              <Text className="mb-2 text-gray-700">Prix unitaire</Text>
              <CustomInput
                control={control}
                name="pu"
                placeholder="Ex: 150.00"
                keyboardType="numeric"
                rules={{ required: "Prix unitaire est requis" }}
                error={errors.pu?.message}
                type="numeric"
              />
            </View>

            <CustomButton
              title="Enregistrer"
              handlePress={handleSubmit(onSubmit)}
              // isLoading={isLoading}
              containerStyles="w-full rounded rounded-full"
              textStyles="text-white tracking-wide"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddFormProduit;
