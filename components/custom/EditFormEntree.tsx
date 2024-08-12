import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  useForm,
  Controller,
  useFieldArray,
  SubmitHandler,
} from "react-hook-form";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import BonEntree from "@/types/entree.type";
import ActionButton from "../ActionButton";
import CustomIcon from "../CustomIcon";
import CustomButton from "../CustomButton";
import ProduitService from "@/services/produit.service";
import EntreeService from "@/services/entree.service";

type EntreeInput = {
  id_entree: number;
  id_produit: number;
  qte_entree: number;
  date_production: Date;
  date_peremption: Date;
};

type BonEntreeInput = {
  id_bon_entree: number;
  date_entree: Date;
  entrees: EntreeInput[];
};

type BonEntreeFormEditProps = {
  bon_entree: BonEntree;
};

const EditFormBonEntree = ({ bon_entree }: BonEntreeFormEditProps) => {
  //Logique de modal
  const [isModalVisible, setModalVisibility] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<BonEntreeInput>({
    mode: "all",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "entrees",
  });

  const { fetchProduits } = ProduitService();
  const { data: produits } = useQuery({
    queryKey: ["produits"],
    queryFn: fetchProduits,
  });

  // Mise à jour des valeurs du formulaire lorsque le modal s'ouvre
  useEffect(() => {
    if (isModalVisible) {
      reset({
        id_bon_entree: bon_entree.id_bon_entree,
        date_entree: new Date(),
        entrees: bon_entree.entrees.map((entree) => ({
          id_entree: entree.id_entree,
          id_produit: entree.id_produit,
          qte_entree: entree.qte_entree,
          date_production: entree.lot?.date_production
            ? new Date(entree.lot.date_production)
            : undefined,
          date_peremption: entree.lot?.date_peremption
            ? new Date(entree.lot.date_peremption)
            : undefined,
        })),
      });
    }
  }, [isModalVisible, bon_entree, reset]);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [currentDateField, setCurrentDateField] = useState<{
    name: keyof EntreeInput | "date_entree";
    index: number;
  } | null>(null);

  const showDatePicker = (
    name: keyof EntreeInput | "date_entree",
    index: number
  ) => {
    setCurrentDateField({ name, index });
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    setCurrentDateField(null);
  };

  const handleConfirm = (date: Date) => {
    if (currentDateField) {
      if (currentDateField.name === "date_entree") {
        setValue("date_entree", date);
      } else {
        setValue(
          `entrees.${currentDateField.index}.${currentDateField.name}`,
          date
        );
      }
    }
    hideDatePicker();
  };

  const { updateBonEntree } = EntreeService();

  const queryClient = useQueryClient();
  const onSubmit: SubmitHandler<BonEntreeInput> = (data) => {
    const transformedData = {
      ...data,
      id_bon_entree: data.id_bon_entree,
      entrees: data.entrees.map((entree) => ({
        ...entree,
        date_production: entree.date_production.toISOString(),
        date_peremption: entree.date_peremption.toISOString(),
      })),
      date_entree: data.date_entree.toISOString(),
    };
    updateBonEntree(transformedData, () => {
      queryClient.invalidateQueries({ queryKey: ["bon_entrees"] });
      queryClient.invalidateQueries({ queryKey: ["produits"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["lots"] });
      setModalVisibility(false);
      reset();
    });
  };

  return (
    <View className="relative bg-gray-100">
      <ActionButton
        title="Modifier"
        iconName="pencil"
        handlePress={() => setModalVisibility(true)}
        type="edit"
        size="xl"
        iconColor="#3b82f6"
      />

      {/* Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black/50 p-4">
          <View className="relative w-full max-w-full  rounded-3xl">
            <ScrollView className="relative w-full max-w-lg bg-white p-6   rounded-3xl z-0">
              <TouchableOpacity
                onPress={() => {
                  setModalVisibility(false);
                  reset();
                }}
                className="absolute -right-2 -top-2 p-2 z-20"
              >
                <View className="p-2 bg-red-50 rounded-full">
                  <CustomIcon name="close" color="#DC2626" size={24} />
                </View>
              </TouchableOpacity>

              <Text className="text-xl font-psemibold text-custom-black mb-6">
                Modifier une entrée
              </Text>

              <View style={styles.datePickerContainer}>
                <Text>Date d'entrée :</Text>
                <Controller
                  control={control}
                  name="date_entree"
                  rules={{ required: "Date d'entrée est requise" }}
                  render={({ field: { value } }) => (
                    <View className="relative">
                      <CustomButton
                        title={
                          value
                            ? value.toISOString().split("T")[0]
                            : "Sélectionner une date"
                        }
                        handlePress={() => showDatePicker("date_entree", -1)}
                        className="relative bg-slate-100 pl-2 pr-10 space-x-4 h-10 flex flex-row justify-between items-center rounded-md"
                      />

                      <View className="absolute top-2 right-2">
                        <CustomIcon
                          name="calendar-outline"
                          size={20}
                          color="gray"
                        />
                      </View>

                      {errors.date_entree && (
                        <Text className="text-red-500">
                          {errors.date_entree.message}
                        </Text>
                      )}
                    </View>
                  )}
                />
              </View>

              {fields.map((field, index) => (
                <View key={field.id}>
                  <Text>Produits :</Text>
                  <Controller
                    control={control}
                    name={`entrees.${index}.id_produit`}
                    rules={{ required: "Le produit est requis" }}
                    render={({ field: { onChange, value } }) => (
                      <Picker
                        selectedValue={value}
                        onValueChange={(itemValue: number) =>
                          onChange(itemValue)
                        }
                      >
                        <Picker.Item label="Sélectionnez un produit" value="" />
                        {produits?.map((produit) => (
                          <Picker.Item
                            key={produit.id_produit}
                            label={produit.designation}
                            value={produit.id_produit}
                          />
                        ))}
                      </Picker>
                    )}
                  />
                  {errors.entrees?.[index]?.id_produit && (
                    <Text style={{ color: "red" }}>
                      {errors.entrees[index].id_produit?.message}
                    </Text>
                  )}

                  <View className="mb-4 flex flex-row justify-between items-center">
                    <Text className="mb-2">Quantité d'entrée :</Text>
                    <Controller
                      control={control}
                      name={`entrees.${index}.qte_entree`}
                      rules={{ required: "La quantité d'entrée est requise" }}
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          className="border p-2 h-8 rounded-md w-[134]"
                          value={value.toString()}
                          keyboardType="numeric"
                          onChangeText={(text) => onChange(Number(text))}
                        />
                      )}
                    />
                    {errors.entrees?.[index]?.qte_entree && (
                      <Text className="text-red-500 mt-1">
                        {" "}
                        {errors.entrees[index].qte_entree?.message}
                      </Text>
                    )}
                  </View>

                  <View style={styles.datePickerContainer}>
                    <Text className="mb-2">Date de production :</Text>
                    <Controller
                      control={control}
                      name={`entrees.${index}.date_production`}
                      rules={{ required: "La date de production est requise" }}
                      render={({ field: { value } }) => (
                        <View className="relative">
                          <CustomButton
                            title={
                              value
                                ? value.toISOString().split("T")[0]
                                : "Sélectionner une date"
                            }
                            handlePress={() =>
                              showDatePicker("date_production", index)
                            }
                            className="relative bg-slate-100 pl-2 pr-10 space-x-4 h-10 flex flex-row justify-between items-center rounded-md"
                          />
                          {errors.entrees?.[index]?.date_production && (
                            <Text style={{ color: "red" }}>
                              {errors.entrees[index].date_production?.message}
                            </Text>
                          )}
                          <View className="absolute top-2 right-2">
                            <CustomIcon
                              name="calendar-outline"
                              size={20}
                              color="gray"
                            />
                          </View>
                        </View>
                      )}
                    />
                  </View>
                  <View style={styles.datePickerContainer}>
                    <Text className="mb-2">Date de péremption :</Text>
                    <Controller
                      control={control}
                      name={`entrees.${index}.date_peremption`}
                      rules={{ required: "La date de péremption est requise" }}
                      render={({ field: { value } }) => (
                        <View className="relative">
                          <CustomButton
                            title={
                              value
                                ? value.toISOString().split("T")[0]
                                : "Sélectionner une date"
                            }
                            handlePress={() =>
                              showDatePicker("date_peremption", index)
                            }
                            className="relative bg-slate-100 pl-2 pr-10 space-x-4 h-10 flex flex-row justify-between items-center rounded-md"
                          />
                          {errors.entrees?.[index]?.date_peremption && (
                            <Text style={{ color: "red" }}>
                              {errors.entrees[index].date_peremption?.message}
                            </Text>
                          )}

                          <View className="absolute top-2 right-2">
                            <CustomIcon
                              name="calendar-outline"
                              size={20}
                              color="gray"
                            />
                          </View>
                        </View>
                      )}
                    />
                  </View>

                  <View className="flex flex-row justify-between  border-b border-slate-300 rounded-md pb-4 mb-4">
                    <ActionButton
                      title="Supprimer"
                      iconName="trash"
                      handlePress={() => remove(index)}
                      type="delete"
                      size="xl"
                      iconColor="#ef4444"
                    />

                    <ActionButton
                      title="Ajouter produit"
                      iconName="pencil"
                      handlePress={() =>
                        append({
                          id_entree: 0,
                          id_produit: 0,
                          qte_entree: 1,
                          date_production: new Date(),
                          date_peremption: new Date(),
                        })
                      }
                      type="edit"
                      size="xl"
                      iconColor="#3b82f6"
                    />
                  </View>
                </View>
              ))}

              <CustomButton
                title="Modifier"
                handlePress={handleSubmit(onSubmit)}
                // isLoading={isLoading}
                containerStyles="w-full rounded rounded-full"
                textStyles="text-white tracking-wide"
              />

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              />

              <View className="mb-12"></View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EditFormBonEntree;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  datePickerButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
  },
  clearDateButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
  },
});
