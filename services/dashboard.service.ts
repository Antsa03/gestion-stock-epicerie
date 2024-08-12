// DashboardService.ts
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as models from "@/database/schemas/models";
import { eq, and, gte, lte } from "drizzle-orm";
import { subMonths, startOfMonth, endOfMonth, format } from "date-fns";

const DashboardService = () => {
  const database = useSQLiteContext();
  const db = drizzle(database, { schema: models });

  async function getDashboardData() {
    try {
      const currentDate = new Date();
      // Sales histogram for the last 6 months
      const histogram = await Promise.all(
        Array.from({ length: 6 }, async (_, i) => {
          const monthStart = startOfMonth(subMonths(currentDate, i));
          const monthEnd = endOfMonth(subMonths(currentDate, i));

          const sales = await db.query.BonSortie.findMany({
            where: and(
              gte(
                models.BonSortie.date_sortie,
                format(monthStart, "yyyy-MM-dd")
              ),
              lte(models.BonSortie.date_sortie, format(monthEnd, "yyyy-MM-dd"))
            ),
            with: {
              sorties: {
                where: eq(models.Sortie.type_sortie, "Vente"),
                with: {
                  produit: true,
                },
              },
            },
          });

          const totalSales = sales
            .flatMap((bonSortie) =>
              bonSortie.sorties.map(
                (sortie) => sortie.qte_sortie * sortie.produit.pu
              )
            )
            .reduce((sum, sale) => sum + sale, 0);

          return {
            month: monthStart,
            totalSales,
          };
        })
      );

      // Total sales
      const allSales = await db.query.BonSortie.findMany({
        with: {
          sorties: {
            where: eq(models.Sortie.type_sortie, "Vente"),
            with: {
              produit: true,
            },
          },
        },
      });

      const totalSales = allSales
        .flatMap((bonSortie) =>
          bonSortie.sorties.map(
            (sortie) => sortie.qte_sortie * sortie.produit.pu
          )
        )
        .reduce((sum, sale) => sum + sale, 0);

      return {
        histogram: histogram.reverse(),
        totalSales,
      };
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      throw new Error("Failed to fetch dashboard data");
    }
  }

  return { getDashboardData };
};

export default DashboardService;
