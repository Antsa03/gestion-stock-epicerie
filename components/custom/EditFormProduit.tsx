import { Alert, Modal, Text, TouchableOpacity, View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import ActionButton from "../ActionButton";
import Produit from "@/types/produit.type";
import CustomIcon from "../CustomIcon";
import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";
import ProduitService from "@/services/produit.service";

type EditFormProduitProps = {
  produit: Produit;
};

const EditFormProduit = ({ produit }: EditFormProduitProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Produit>({
    mode: "all",
  });

  const { updateProduit, isUpdating } = ProduitService();
  const queryClient = useQueryClient();
  const [isModalVisible, setModalVisibility] = useState(false);

  // Mise à jour des valeurs du formulaire lorsque le modal s'ouvre
  useEffect(() => {
    if (isModalVisible) {
      reset({
        ...produit,
      });
    }
  }, [isModalVisible, produit, reset]);

  const onSubmit: SubmitHandler<Produit> = (data) => {
    updateProduit(data, () => {
      setModalVisibility(false);
      queryClient.invalidateQueries({ queryKey: ["produits"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["lots"] });
    });
  };

  return (
    <View className="relative bg-light-50">
      <ActionButton
        title=""
        iconName="pencil"
        handlePress={() => setModalVisibility(true)}
        type="edit"
        size="lg"
        iconColor="#3b82f6"
      />
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black/50 p-4">
          <View className="relative w-full max-w-lg bg-white p-6 rounded-3xl ">
            <TouchableOpacity
              onPress={() => {
                setModalVisibility(false);
              }}
              className="absolute right-1 top-1 p-2 z-20"
            >
              <View className="p-2 bg-red-50 rounded-full">
                <CustomIcon name="close" color="#DC2626" size={24} />
              </View>
            </TouchableOpacity>
            <Text className="text-xl font-psemibold text-custom-black mb-6">
              Modifier un produit
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
              title="Modifier"
              handlePress={handleSubmit(onSubmit)}
              isLoading={isUpdating}
              containerStyles="w-full rounded rounded-full"
              textStyles="text-white tracking-wide"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EditFormProduit;
