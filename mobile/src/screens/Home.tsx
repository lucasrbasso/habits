import { View, Text, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import { Header } from "../components/Header";

import { generateDateFromYearBeginning } from "../utils/generate-range-from-year-beginning";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
const summaryDates = generateDateFromYearBeginning();
const minimumSummaryDatesSize = 18 * 5;
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length;

export function Home() {
  const { navigate } = useNavigation();

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />

      <View className="flex-row mt-6 mb-2">
        {weekDays.map((day, index) => (
          <Text
            className="text-zinc-400 text-xl font-bold text-center mx-1"
            key={`${day} - ${index}`}
            style={{ width: DAY_SIZE }}
          >
            {day}
          </Text>
        ))}
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex-row flex-wrap">
          {summaryDates.map((date) => (
            <HabitDay
              onPress={() => navigate("habit", { date: date.toISOString() })}
              key={date.toISOString()}
            />
          ))}
          {amountOfDaysToFill > 0 &&
            Array.from({ length: amountOfDaysToFill }).map((_, i) => (
              <View
                key={i}
                className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                style={{ width: DAY_SIZE, height: DAY_SIZE }}
              />
            ))}
        </View>
      </ScrollView>
    </View>
  );
}
