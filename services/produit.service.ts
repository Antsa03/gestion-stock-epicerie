import { Alert } from "react-native";
import { useState } from "react";
import ProduitType from "@/types/produit.type";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as models from "@/database/schemas/models";
import { desc, eq } from "drizzle-orm";
const ProduitService = () => {
  //Récupération de l'instance de la base de données
  const database = useSQLiteContext();
  const db = drizzle(database, { schema: models });

  async function fetchProduits() {
    try {
      const response = await db.query.Produit.findMany({
        orderBy: [desc(models.Produit.id_produit)],
      });

      // console.log(response)
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  const createProduit = async (produit: ProduitType, onSucces?: () => void) => {
    try {
      const response = await db.insert(models.Produit).values(produit);
      if (response.lastInsertRowId) {
        if (onSucces) onSucces();
        Alert.alert("Produit ajouté avec l'ID: " + response.lastInsertRowId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Mise à jour produit
  const [isUpdating, setIsUpdating] = useState(false);
  const updateProduit = async (produit: ProduitType, onSucces?: () => void) => {
    try {
      setIsUpdating(true);
      const response = await db
        .update(models.Produit)
        .set(produit)
        .where(eq(models.Produit.id_produit, produit.id_produit));

      if (response.changes > 0) {
        if (onSucces) onSucces();
        Alert.alert("Produit modifié avec succès");
      } else {
        Alert.alert("Aucun produit n'a été modifié");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du produit:", error);
      Alert.alert("Erreur lors de la modification du produit");
    } finally {
      setIsUpdating(false);
    }
  };

  //Suppression
  const [isDeleting, setIsDeleting] = useState(false);
  async function removeProduit(id: number, onSucces?: () => void) {
    try {
      setIsDeleting(true);
      Alert.alert("Supprimé", "Voulez-vous vraiment le supprimé?", [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Confirmer",
          onPress: async () => {
            await db
              .delete(models.Produit)
              .where(eq(models.Produit.id_produit, id));
            if (onSucces) onSucces();
          },
        },
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  }

  return {
    fetchProduits,
    createProduit,
    updateProduit,
    isUpdating,
    removeProduit,
    isDeleting,
  };
};

export default ProduitService;
