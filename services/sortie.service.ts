import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as models from "@/database/schemas/models";
import { eq, sql } from "drizzle-orm";
import { Alert } from "react-native";
import { useState } from "react";

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

type BonSortieUpdateInput = {
  id_bon_sortie: number;
  date_sortie: string;
  sorties: (SortieInput & { id_sortie: number })[];
};

const SortieService = () => {
  const database = useSQLiteContext();
  const db = drizzle(database, { schema: models });

  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function fetchBonSorties() {
    try {
      setIsLoading(true);
      const bonSorties = await db.query.BonSortie.findMany({
        with: {
          sorties: {
            with: {
              produit: true,
              lot: true,
            },
          },
        },
      });
      return bonSorties;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des bons de sortie:",
        error
      );
      Alert.alert("Erreur lors de la récupération des bons de sortie");
    } finally {
      setIsLoading(false);
    }
  }

  async function createBonSortie(
    bonSortieInput: BonSortieInput,
    onSuccess?: () => void
  ) {
    try {
      setIsAdding(true);
      await db.transaction(async (tx) => {
        // Vérifier le stock et la péremption pour chaque sortie
        for (const sortie of bonSortieInput.sorties) {
          const lot = await tx.query.Lot.findFirst({
            where: eq(models.Lot.id_lot, sortie.id_lot),
          });
          if (!lot || lot.quantite_lot < sortie.qte_sortie) {
            throw new Error(
              `Stock insuffisant dans le lot pour le produit ${sortie.id_produit}`
            );
          }
          if (new Date() > new Date(lot.date_peremption)) {
            throw new Error(`Produit ${sortie.id_produit} périmé`);
          }
        }

        // Créer le bon de sortie
        const bonSortie = await tx
          .insert(models.BonSortie)
          .values({
            date_sortie: bonSortieInput.date_sortie,
          })
          .returning()
          .get();

        // Créer les sorties et mettre à jour les stocks
        for (const sortie of bonSortieInput.sorties) {
          await tx.insert(models.Sortie).values({
            id_bon_sortie: bonSortie.id_bon_sortie,
            id_produit: sortie.id_produit,
            qte_sortie: sortie.qte_sortie,
            id_lot: sortie.id_lot,
            type_sortie: sortie.type_sortie,
          });

          await tx
            .update(models.Produit)
            .set({ stock: sql`${models.Produit.stock} - ${sortie.qte_sortie}` })
            .where(eq(models.Produit.id_produit, sortie.id_produit));

          await tx
            .update(models.Lot)
            .set({
              quantite_lot: sql`${models.Lot.quantite_lot} - ${sortie.qte_sortie}`,
            })
            .where(eq(models.Lot.id_lot, sortie.id_lot));
        }
      });

      if (onSuccess) onSuccess();
      Alert.alert("Bon de sortie créé avec succès");
    } catch (error) {
      console.error("Erreur lors de la création du bon de sortie:", error);
      Alert.alert(
        "Erreur",
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la création du bon de sortie"
      );
    } finally {
      setIsAdding(false);
    }
  }

  async function updateBonSortie(
    bonSortieUpdateInput: BonSortieUpdateInput,
    onSuccess?: () => void
  ) {
    try {
      setIsUpdating(true);
      await db.transaction(async (tx) => {
        const currentBonSortie = await tx.query.BonSortie.findFirst({
          where: eq(
            models.BonSortie.id_bon_sortie,
            bonSortieUpdateInput.id_bon_sortie
          ),
          with: { sorties: true },
        });

        if (!currentBonSortie) {
          throw new Error("Bon de sortie non trouvé");
        }

        for (const newSortie of bonSortieUpdateInput.sorties) {
          const currentSortie = currentBonSortie.sorties.find(
            (sortie) => sortie.id_sortie === newSortie.id_sortie
          );

          if (!currentSortie) {
            throw new Error("Sortie non trouvée");
          }

          const lot = await tx.query.Lot.findFirst({
            where: eq(models.Lot.id_lot, newSortie.id_lot),
          });

          if (!lot || lot.quantite_lot < newSortie.qte_sortie) {
            throw new Error(
              `Stock insuffisant dans le lot pour le produit ${newSortie.id_produit}`
            );
          }

          if (new Date() > new Date(lot.date_peremption)) {
            throw new Error(`Produit ${newSortie.id_produit} périmé`);
          }

          const quantityDifference =
            newSortie.qte_sortie - currentSortie.qte_sortie;

          if (quantityDifference !== 0) {
            await tx
              .update(models.Produit)
              .set({
                stock: sql`${models.Produit.stock} - ${quantityDifference}`,
              })
              .where(eq(models.Produit.id_produit, newSortie.id_produit));

            await tx
              .update(models.Lot)
              .set({
                quantite_lot: sql`${models.Lot.quantite_lot} - ${quantityDifference}`,
              })
              .where(eq(models.Lot.id_lot, newSortie.id_lot));
          }

          await tx
            .update(models.Sortie)
            .set({
              qte_sortie: newSortie.qte_sortie,
              id_lot: newSortie.id_lot,
              type_sortie: newSortie.type_sortie,
            })
            .where(eq(models.Sortie.id_sortie, newSortie.id_sortie));
        }

        await tx
          .update(models.BonSortie)
          .set({ date_sortie: bonSortieUpdateInput.date_sortie })
          .where(
            eq(
              models.BonSortie.id_bon_sortie,
              bonSortieUpdateInput.id_bon_sortie
            )
          );
      });

      if (onSuccess) onSuccess();
      Alert.alert("Bon de sortie mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du bon de sortie:", error);
      Alert.alert(
        "Erreur",
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la mise à jour du bon de sortie"
      );
    } finally {
      setIsUpdating(false);
    }
  }

  async function removeBonSortie(id: number, onSuccess?: () => void) {
    try {
      setIsDeleting(true);
      Alert.alert(
        "Suppression",
        "Voulez-vous vraiment supprimer ce bon de sortie ?",
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Confirmer",
            onPress: async () => {
              await db.transaction(async (tx) => {
                const sorties = await tx.query.Sortie.findMany({
                  where: eq(models.Sortie.id_bon_sortie, id),
                });

                for (const sortie of sorties) {
                  await tx
                    .update(models.Produit)
                    .set({
                      stock: sql`${models.Produit.stock} + ${sortie.qte_sortie}`,
                    })
                    .where(eq(models.Produit.id_produit, sortie.id_produit));

                  await tx
                    .update(models.Lot)
                    .set({
                      quantite_lot: sql`${models.Lot.quantite_lot} + ${sortie.qte_sortie}`,
                    })
                    .where(eq(models.Lot.id_lot, sortie.id_lot));
                }

                await tx
                  .delete(models.Sortie)
                  .where(eq(models.Sortie.id_bon_sortie, id));

                await tx
                  .delete(models.BonSortie)
                  .where(eq(models.BonSortie.id_bon_sortie, id));
              });

              if (onSuccess) onSuccess();
              Alert.alert("Bon de sortie supprimé avec succès");
            },
          },
        ]
      );
    } catch (error) {
      console.error("Erreur lors de la suppression du bon de sortie:", error);
      Alert.alert("Erreur lors de la suppression du bon de sortie");
    } finally {
      setIsDeleting(false);
    }
  }

  return {
    fetchBonSorties,
    createBonSortie,
    updateBonSortie,
    removeBonSortie,
    isLoading,
    isAdding,
    isUpdating,
    isDeleting,
  };
};

export default SortieService;
