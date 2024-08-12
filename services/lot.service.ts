import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as models from "@/database/schemas/models";
import { Alert } from "react-native";
import { eq } from "drizzle-orm";

const LotService = () => {
  const database = useSQLiteContext();
  const db = drizzle(database, { schema: models });

  async function fetchLots() {
    try {
      const lots = await db.query.Lot.findMany({
        with: {
          produit: true,
        },
      });
      return lots;
    } catch (error) {
      console.error("Erreur lors de la récupération des lots:", error);
      Alert.alert("Erreur lors de la récupération des lots");
    }
  }

  async function getProductIdFromLot(id_lot: number): Promise<number | null> {
    try {
      const lot = await db.query.Lot.findFirst({
        where: eq(models.Lot.id_lot, id_lot),
        columns: {
          id_produit: true,
        },
      });

      if (lot) {
        return lot.id_produit;
      } else {
        console.log(`Aucun lot trouvé avec l'id ${id_lot}`);
        return null;
      }
    } catch (error) {
      console.error(
        `Erreur lors de la récupération de l'id_produit pour le lot ${id_lot}:`,
        error
      );
      Alert.alert(
        `Erreur lors de la récupération des informations du lot ${id_lot}`
      );
      return null;
    }
  }

  return { fetchLots, getProductIdFromLot };
};

export default LotService;
