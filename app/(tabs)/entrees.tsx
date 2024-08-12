import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import CardEntree from "@/components/CardEntree";
import EmptyState from "@/components/EmptyState";
import Images from "@/constants/images";
import CustomIcon from "@/components/CustomIcon";
import AddFormEntree from "@/components/custom/AddFormEntree";
import EntreeService from "@/services/entree.service";

function BonEntreePage() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const queryClient = useQueryClient();

  // Refrech the gesture
  const onRefresh = () => {
    setRefreshing(true);
    queryClient.invalidateQueries({ queryKey: ["bon_entrees"] });
    queryClient.invalidateQueries({ queryKey: ["produits"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    queryClient.invalidateQueries({ queryKey: ["lots"] });
    setRefreshing(false);
  };

  // Fetch data for Bon Entrees
  const { fetchBonEntrees, removeBonEntree, isDeleting } = EntreeService();

  const {
    data: bon_entrees,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["bon_entrees"],
    queryFn: fetchBonEntrees,
    staleTime: 1000,
  });

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const filteredBonEntrees = selectedDate
    ? bon_entrees?.filter((bon_entree) => {
        if (bon_entree.date_entree) {
          return (
            new Date(bon_entree.date_entree).toDateString() ===
            selectedDate.toDateString()
          );
        }
        return false;
      })
    : bon_entrees;

  if (isError) return <Text>Erreur: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <View className="w-full flex flex-row justify-between  space-x-2">
        {/* Date Picker Component */}
        <View style={styles.datePickerContainer}>
          <TouchableOpacity
            onPress={showDatePicker}
            className="bg-white px-4 space-x-8 h-12 flex flex-row justify-between items-center rounded-md"
          >
            <View>
              <Text className="">
                {selectedDate
                  ? `Filtrer par date: ${selectedDate.toLocaleDateString()}`
                  : "Sélectionner une date"}
              </Text>
            </View>
            <View>
              <CustomIcon name="calendar-outline" size={24} color="gray" />
            </View>
          </TouchableOpacity>
          {selectedDate && (
            <TouchableOpacity
              onPress={() => setSelectedDate(null)}
              style={styles.clearDateButton}
            >
              <Text className="text-xs">
                <CustomIcon
                  name="close"
                  color="#DC2626"
                  size={24}
                  classname="p-4 mr-6"
                />
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        {/* Add new entry form */}
        <AddFormEntree />
      </View>

      {/* List of Bon Entrees */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredBonEntrees}
          keyExtractor={(item) => item.id_bon_entree.toString()}
          renderItem={({ item }) => (
            <CardEntree
              bon_entree={item}
              onDelete={() =>
                removeBonEntree(item.id_bon_entree, () => {
                  queryClient.invalidateQueries({ queryKey: ["bon_entrees"] });
                  queryClient.invalidateQueries({ queryKey: ["produits"] });
                  queryClient.invalidateQueries({ queryKey: ["dashboard"] });
                  queryClient.invalidateQueries({ queryKey: ["lots"] });
                })
              }
              isDeleting={isDeleting}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              title="Aucune entrée trouvée."
              subtitle="Aucun produit créé pour le moment"
              image={Images.empty}
            />
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          className="rounded-3xl mb-16"
        />
      )}
    </View>
  );
}

export default React.memo(BonEntreePage);

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
