import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import CardProduit from "@/components/CardProduit";
import EmptyState from "@/components/EmptyState";
import Images from "@/constants/images";
import AddFormProduit from "@/components/custom/AddFormProduit";
import ProduitService from "@/services/produit.service";

export default function Produits() {
  const { fetchProduits, removeProduit, isDeleting } = ProduitService();

  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    queryClient.invalidateQueries({ queryKey: ["produits"] });
    setRefreshing(false);
  };

  const {
    data: produits,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["produits"],
    queryFn: fetchProduits,
    staleTime: 5000,
  });

  const queryClient = useQueryClient();

  // Filtrer les produits en fonction de la recherche
  const filteredProduits = useMemo(() => {
    if (!produits) return [];
    return produits.filter((produit) =>
      produit.designation.toLowerCase().includes(search.toLowerCase())
    );
  }, [produits, search]);

  if (error || isError) return <Text>{error.message}</Text>;

  return (
    <SafeAreaView className="flex-1 bg-slate-50 px-4">
      <View className="w-full flex flex-row justify-between mb-6 space-x-2">
        <TextInput
          placeholder="Recherche par désignation ..."
          className="h-12 border border-gray-200 bg-white  rounded-lg pl-4 pr-8"
          onChangeText={setSearch}
          value={search}
        />
        <AddFormProduit />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredProduits}
          keyExtractor={(item) => item.id_produit.toString()}
          renderItem={({ item: produit }) => (
            <CardProduit
              isDeleting={isDeleting}
              produit={produit}
              onDelete={() =>
                removeProduit(produit.id_produit, () => {
                  queryClient.invalidateQueries({ queryKey: ["produits"] });
                  queryClient.invalidateQueries({ queryKey: ["lots"] });
                  queryClient.invalidateQueries({ queryKey: ["dashboard"] });
                })
              }
            />
          )}
          ListEmptyComponent={
            <EmptyState
              title="Aucun produit trouvé"
              subtitle="Aucun produit créé pour le moment"
              image={Images.empty}
            />
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingBottom: 16, gap: 16 }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          className="rounded-3xl"
        />
      )}
    </SafeAreaView>
  );
}
