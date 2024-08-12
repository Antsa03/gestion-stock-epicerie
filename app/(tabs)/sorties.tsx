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
import CardSortie from "@/components/CardSortie";
import EmptyState from "@/components/EmptyState";
import Images from "@/constants/images";
import CustomIcon from "@/components/CustomIcon";
import SortieService from "@/services/sortie.service";
import AddFormSortie from "@/components/custom/AddFormSortie";

export default function Bonsortie() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Refrech the gesture
  const onRefresh = () => {
    setRefreshing(true);
    queryClient.invalidateQueries({ queryKey: ["bon_sorties"] });
    queryClient.invalidateQueries({ queryKey: ["produits"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    queryClient.invalidateQueries({ queryKey: ["lots"] });
    setRefreshing(false);
  };

  // Fetch data for Bon Sorties
  const { fetchBonSorties, removeBonSortie, isDeleting } = SortieService();
  const {
    data: bon_sorties,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["bon_sorties"],
    queryFn: fetchBonSorties,
    staleTime: 1000,
  });

  // Deletion logic
  const queryClient = useQueryClient();

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

  const filteredBonSorties = selectedDate
    ? bon_sorties?.filter(
        (bon_sortie) =>
          new Date(bon_sortie.date_sortie).toDateString() ===
          selectedDate.toDateString()
      )
    : bon_sorties;

  if (isError) return <Text>Erreur: {error.message}</Text>;

  return (
    <View style={styles.container}>
      <View className="w-full flex flex-row justify-between space-x-2">
        {/* Date Picker Component */}
        <View style={styles.datePickerContainer}>
          <TouchableOpacity
            onPress={showDatePicker}
            className="bg-white px-4 space-x-8 h-12 flex flex-row justify-between items-center rounded-md"
          >
            <View>
              <Text>
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
                <CustomIcon name="close" color="#DC2626" size={24} />
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

        {/* Add new exit form */}
        <AddFormSortie />
      </View>

      {/* List of Bon Sorties */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredBonSorties}
          keyExtractor={(item) => item.id_bon_sortie.toString()}
          renderItem={({ item }) => (
            <CardSortie
              bon_sortie={item}
              onDelete={() =>
                removeBonSortie(item.id_bon_sortie, () => {
                  queryClient.invalidateQueries({ queryKey: ["bon_sorties"] });
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
              title="Aucune sortie trouvée."
              subtitle="Aucun produit sorti pour le moment"
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
  clearDateButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
  },
});
