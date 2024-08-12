import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as models from "@/database/schemas/models";
import { eq, sql } from "drizzle-orm";
import { Alert } from "react-native";
import { useState } from "react";

type EntreeInput = {
  id_produit: number;
  qte_entree: number;
  date_production: string;
  date_peremption: string;
};

type BonEntreeInput = {
  date_entree: string;
  entrees: EntreeInput[];
};

type EntreeUpdateInput = {
  id_entree: number;
  id_produit: number;
  qte_entree: number;
  date_production: string;
  date_peremption: string;
};

type BonEntreeUpdateInput = {
  id_bon_entree: number;
  date_entree: string;
  entrees: EntreeUpdateInput[];
};

const EntreeService = () => {
  const database = useSQLiteContext();
  const db = drizzle(database, { schema: models });

  async function fetchBonEntrees() {
    try {
      const response = await db.query.BonEntree.findMany({
        with: {
          entrees: {
            with: {
              produit: true,
              lot: true,
            },
          },
        },
      });
      return response;
    } catch (error) {
      console.error(error);
      throw new Error("Erreur lors de la récupération des bons d'entrée");
    }
  }

  const [isAdding, setisAdding] = useState(false);
  const createBonEntree = async (
    bonEntreeInput: BonEntreeInput,
    onSuccess?: () => void
  ) => {
    try {
      setisAdding(true);

      // Commencer une transaction
      await db.transaction(async (tx) => {
        // Créer le bon d'entrée
        const bonEntree = await tx
          .insert(models.BonEntree)
          .values({
            date_entree: bonEntreeInput.date_entree,
          })
          .returning()
          .get();

        // Créer les entrées et les lots associés
        for (const entree of bonEntreeInput.entrees) {
          // Créer un nouveau lot
          const newLot = await tx
            .insert(models.Lot)
            .values({
              id_produit: entree.id_produit,
              date_production: entree.date_production,
              date_peremption: entree.date_peremption,
              quantite_lot: entree.qte_entree,
            })
            .returning()
            .get();

          // Créer l'entrée
          await tx.insert(models.Entree).values({
            id_produit: entree.id_produit,
            id_bon_entree: bonEntree.id_bon_entree,
            qte_entree: entree.qte_entree,
            id_lot: newLot.id_lot,
          });

          // Mettre à jour le stock du produit
          await tx
            .update(models.Produit)
            .set({
              stock: sql`${models.Produit.stock} + ${entree.qte_entree}`,
            })
            .where(eq(models.Produit.id_produit, entree.id_produit));
        }
      });

      if (onSuccess) onSuccess();
      Alert.alert("Bon d'entrée créé avec succès");
    } catch (error) {
      console.error("Erreur lors de la création du bon d'entrée:", error);
      Alert.alert("Erreur lors de la création du bon d'entrée");
    } finally {
      setisAdding(false);
    }
  };

  //mise à jour
  const [isUpdating, setIsUpdating] = useState(false);

  const updateBonEntree = async (
    bonEntreeUpdateInput: BonEntreeUpdateInput,
    onSuccess?: () => void
  ) => {
    try {
      setIsUpdating(true);

      await db.transaction(async (tx) => {
        // Update BonEntree
        await tx
          .update(models.BonEntree)
          .set({ date_entree: bonEntreeUpdateInput.date_entree })
          .where(
            eq(
              models.BonEntree.id_bon_entree,
              bonEntreeUpdateInput.id_bon_entree
            )
          );

        // Update Entrees and related Lots
        for (const entree of bonEntreeUpdateInput.entrees) {
          // Get current entree to calculate quantity difference
          const currentEntree = await tx.query.Entree.findFirst({
            where: eq(models.Entree.id_entree, entree.id_entree),
            with: { lot: true },
          });

          if (!currentEntree) {
            throw new Error(`Entree with ID ${entree.id_entree} not found.`);
          }

          const quantityDifference =
            entree.qte_entree - currentEntree.qte_entree;

          // Update Lot
          await tx
            .update(models.Lot)
            .set({
              date_production: entree.date_production,
              date_peremption: entree.date_peremption,
              quantite_lot: entree.qte_entree,
            })
            .where(eq(models.Lot.id_lot, currentEntree.lot.id_lot));

          // Update Produit stock
          await tx
            .update(models.Produit)
            .set({
              stock: sql`${models.Produit.stock} + ${quantityDifference}`,
            })
            .where(eq(models.Produit.id_produit, entree.id_produit));

          // Update Entree
          await tx
            .update(models.Entree)
            .set({ qte_entree: entree.qte_entree })
            .where(eq(models.Entree.id_entree, entree.id_entree));
        }
      });

      if (onSuccess) onSuccess();
      Alert.alert("Bon d'entrée mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du bon d'entrée:", error);
      Alert.alert("Erreur lors de la mise à jour du bon d'entrée");
    } finally {
      setIsUpdating(false);
    }
  };

  //Suppression
  const [isDeleting, setIsDeleting] = useState(false);
  async function removeBonEntree(
    id_bon_entree: number,
    onSuccess?: () => void
  ) {
    try {
      setIsDeleting(true);

      Alert.alert(
        "Suppression",
        "Voulez-vous vraiment supprimer ce bon d'entrée ?",
        [
          {
            text: "Annuler",
            style: "cancel",
          },
          {
            text: "Confirmer",
            onPress: async () => {
              await db.transaction(async (tx) => {
                // Récupérer toutes les entrées associées au bon d'entrée
                const entrees = await tx.query.Entree.findMany({
                  where: eq(models.Entree.id_bon_entree, id_bon_entree),
                  with: { lot: true },
                });

                // Mettre à jour le stock de chaque produit et supprimer les lots
                for (const entree of entrees) {
                  // Décrémenter le stock du produit
                  await tx
                    .update(models.Produit)
                    .set({
                      stock: sql`${models.Produit.stock} - ${entree.qte_entree}`,
                    })
                    .where(eq(models.Produit.id_produit, entree.id_produit));

                  // Supprimer le lot associé
                  await tx
                    .delete(models.Lot)
                    .where(eq(models.Lot.id_lot, entree.lot.id_lot));
                }

                // Supprimer les entrées associées au bon d'entrée
                await tx
                  .delete(models.Entree)
                  .where(eq(models.Entree.id_bon_entree, id_bon_entree));

                // Supprimer le bon d'entrée
                await tx
                  .delete(models.BonEntree)
                  .where(eq(models.BonEntree.id_bon_entree, id_bon_entree));
              });

              if (onSuccess) onSuccess();
              Alert.alert("Bon d'entrée supprimé avec succès");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Erreur lors de la suppression du bon d'entrée:", error);
      Alert.alert("Erreur lors de la suppression du bon d'entrée");
    } finally {
      setIsDeleting(false);
    }
  }

  return {
    fetchBonEntrees,
    createBonEntree,
    updateBonEntree,
    removeBonEntree,
    isDeleting,
    isAdding,
    isUpdating,
  };
};

export default EntreeService;
