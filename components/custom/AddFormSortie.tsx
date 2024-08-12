import React, { useState } from "react";
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
import PlusButton from "../PlusButton";
import CustomIcon from "../CustomIcon";
import CustomButton from "../CustomButton";
import ActionButton from "../ActionButton";
import LotService from "@/services/lot.service";
import SortieService from "@/services/sortie.service";

type SortieInput = {
  id_produit: number;
  qte_sortie: number;
  id_lot: number;
  type_sortie: string;
};

type BonSortieInput = {
  date_sortie: string;
  sorties: SortieInput[];
};

const AddFormSortie = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<BonSortieInput>({
    mode: "all",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sorties",
  });

  const { fetchLots, getProductIdFromLot } = LotService();
  const { data: lots } = useQuery({
    queryKey: ["lots"],
    queryFn: fetchLots,
  });

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [currentDateField, setCurrentDateField] = useState<{
    name: keyof BonSortieInput;
    index: number;
  } | null>(null);

  const showDatePicker = (name: keyof BonSortieInput, index: number) => {
    setCurrentDateField({ name, index });
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    setCurrentDateField(null);
  };

  const handleConfirm = (date: Date) => {
    if (currentDateField) {
      setValue(currentDateField.name, new Date(date).toISOString());
    }
    hideDatePicker();
  };

  const { createBonSortie } = SortieService();

  const queryClient = useQueryClient();
  const onSubmit: SubmitHandler<BonSortieInput> = async (data) => {
    for (const sortie of data.sorties) {
      sortie.id_produit = (await getProductIdFromLot(sortie.id_lot)) || 0;
    }
    createBonSortie(data, () => {
      setModalVisibility(false);
      reset();
      queryClient.invalidateQueries({ queryKey: ["bon_sorties"] });
      queryClient.invalidateQueries({ queryKey: ["produits"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["lots"] });
    });
  };

  const [isModalVisible, setModalVisibility] = useState(false);

  return (
    <View className="relative bg-gray-100">
      <PlusButton handlePress={() => setModalVisibility(true)} title="Plus" />

      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black/50 p-4">
          <View className="relative w-full max-w-full rounded-3xl">
            <ScrollView className="relative w-full max-w-lg bg-white p-6 rounded-3xl z-0">
              {/* CLOSE MODAL */}
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
                Ajouter une sortie
              </Text>

              <View style={styles.datePickerContainer}>
                <Text>Date de sortie</Text>
                <Controller
                  control={control}
                  name="date_sortie"
                  rules={{ required: "Date de sortie est requise" }}
                  render={({ field: { value } }) => (
                    <View className="relative">
                      <CustomButton
                        title={
                          value
                            ? new Date(value).toISOString().split("T")[0]
                            : "Choisir une date"
                        }
                        handlePress={() => showDatePicker("date_sortie", -1)}
                        className="relative bg-slate-100 pl-2 pr-10 space-x-4 h-10 flex flex-row justify-between items-center rounded-md"
                      />

                      <View className="absolute top-2 right-2">
                        <CustomIcon
                          name="calendar-outline"
                          size={20}
                          color="gray"
                        />
                      </View>

                      {errors.date_sortie && (
                        <Text className="text-red-500 mt-1">
                          {errors.date_sortie.message}
                        </Text>
                      )}
                    </View>
                  )}
                />
              </View>

              {fields.map((field, index) => (
                <View key={field.id}>
                  <Text>Lots :</Text>
                  <Controller
                    control={control}
                    name={`sorties.${index}.id_lot`}
                    rules={{ required: "Le lot est requis" }}
                    render={({ field: { onChange, value } }) => (
                      <>
                        <Picker
                          selectedValue={value}
                          onValueChange={(itemValue: number) =>
                            onChange(itemValue)
                          }
                          mode="dropdown"
                        >
                          <Picker.Item label="Sélectionnez un lot" value={0} />
                          {lots?.map((lot) => (
                            <Picker.Item
                              key={lot.id_lot}
                              label={`Lot ${lot.id_lot} - ${
                                lot.produit?.designation
                              } (Qté: ${lot.quantite_lot}, Pér: ${new Date(
                                lot.date_peremption
                              ).toLocaleDateString()})`}
                              value={lot.id_lot}
                            />
                          ))}
                        </Picker>
                        {errors.sorties?.[index]?.id_lot && (
                          <Text style={{ color: "red" }}>
                            {errors.sorties[index]?.id_lot?.message}
                          </Text>
                        )}
                      </>
                    )}
                  />

                  <View className="mb-4 flex flex-row justify-between items-center">
                    <Text className="mb-2">Quantité de sortie :</Text>
                    <Controller
                      control={control}
                      name={`sorties.${index}.qte_sortie`}
                      rules={{ required: "La quantité de sortie est requise" }}
                      render={({ field: { onChange, value } }) => (
                        <>
                          <TextInput
                            className="border p-2 h-8 rounded-md w-[134]"
                            value={value?.toString()}
                            keyboardType="numeric"
                            onChangeText={(text) => onChange(Number(text))}
                          />
                          {errors.sorties?.[index]?.qte_sortie && (
                            <Text style={{ color: "red" }}>
                              {errors.sorties[index]?.qte_sortie?.message}
                            </Text>
                          )}
                        </>
                      )}
                    />
                  </View>

                  <View>
                    <Text>Type</Text>
                    <Controller
                      control={control}
                      name={`sorties.${index}.type_sortie`}
                      rules={{ required: "Le type de sortie est requis" }}
                      render={({ field: { onChange, value } }) => (
                        <>
                          <Picker
                            selectedValue={value}
                            onValueChange={(itemValue: string) =>
                              onChange(itemValue)
                            }
                          >
                            <Picker.Item
                              label="Sélectionnez un type"
                              value=""
                            />
                            <Picker.Item label="Vente" value="Vente" />
                            <Picker.Item
                              label="Péremption"
                              value="Péremption"
                            />
                          </Picker>
                          {errors.sorties?.[index]?.type_sortie && (
                            <Text style={{ color: "red" }}>
                              {errors.sorties[index]?.type_sortie?.message}
                            </Text>
                          )}
                        </>
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
                      className="w-full"
                    />

                    {/* <ActionButton
                      title="Ajouter produit"
                      iconName="pencil"
                      handlePress={() =>
                        append({
                          id_produit: 0,
                          qte_sortie: 1,
                          id_lot: 0,
                          type_sortie: "",
                        })
                      }
                      type="edit"
                      size="xl"
                      iconColor="#3b82f6"
                    /> */}
                  </View>
                </View>
              ))}

              <ActionButton
                title="Ajouter produit"
                iconName="pencil"
                handlePress={() =>
                  append({
                    id_produit: 0,
                    qte_sortie: 1,
                    id_lot: 0,
                    type_sortie: "",
                  })
                }
                type="edit"
                size="xl"
                iconColor="#3b82f6"
                className="mb-"
              />

              <CustomButton
                title="Enregistrer"
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
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddFormSortie;

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
