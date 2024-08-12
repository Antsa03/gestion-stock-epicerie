import React from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { LineChart } from "react-native-chart-kit";
import ProduitService from "@/services/produit.service";
import LotService from "@/services/lot.service";
import DashboardService from "@/services/dashboard.service";
import DashboardCard from "@/components/DashboardCard";
import StockAlertList from "@/components/StockAlertList";
import ExpiringLotsList from "@/components/ExploringLotsList";

const screenWidth = Dimensions.get("window").width;

export default function Index() {
  const { fetchProduits } = ProduitService();
  const {
    data: produits,
    isLoading: isLoadingProduits,
    error: errorProduits,
  } = useQuery({
    queryKey: ["produits"],
    queryFn: fetchProduits,
    staleTime: 5000,
  });

  const { fetchLots } = LotService();
  const {
    data: lots,
    isLoading: isLoadingLots,
    error: errorLots,
  } = useQuery({
    queryKey: ["lots"],
    queryFn: fetchLots,
  });

  const now = new Date();
  const dateLimite = new Date();
  dateLimite.setDate(now.getDate() + 7);

  const { getDashboardData } = DashboardService();
  const {
    data: dashboard,
    isLoading: isLoadingDashboard,
    error: errorDashboard,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardData,
  });

  const lineChartData = {
    labels:
      dashboard?.histogram.map((item) => format(new Date(item.month), "MMM")) ||
      [],
    datasets: [
      {
        data: dashboard?.histogram.map((item) => item.totalSales) || [],
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  if (isLoadingProduits || isLoadingLots || isLoadingDashboard) {
    return <Text>Chargement...</Text>;
  }

  if (errorProduits || errorLots || errorDashboard) {
    return <Text>Erreur lors du chargement des données</Text>;
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50 px-4">
      <ScrollView>
        <View className="bg-light-50 p-4 rounded-2xl">
          <DashboardCard
            title="Recette Total"
            value={`${dashboard?.totalSales.toLocaleString()} Ar`}
          />
          <StockAlertList
            produits={produits?.filter((produit) => produit.stock < 10) || []}
          />
          <ExpiringLotsList
            lots={
              lots?.filter(
                (lot) => new Date(lot.date_peremption) <= dateLimite
              ) || []
            }
            dateLimite={dateLimite}
          />
        </View>

        <View className="w-full mt-4 rounded-3xl">
          <Text className="text-lg font-pmedium text-custom-black  mb-3">
            Recette pendant les 6 derniers mois
          </Text>
          <View className="bg-light-50 p-2 rounded-3xl border border-gray-200">
            <LineChart
              data={lineChartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
        </View>

        <View className="mb-8"></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#ffa726",
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
