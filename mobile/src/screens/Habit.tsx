import { useState, useEffect } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import { BackButton } from "../components/BackButton";
import dayjs from "dayjs";

import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/Checkbox";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";
import { EmptyHabits } from "../components/EmptyHabits";
import { parse } from "react-native-svg";
import clsx from "clsx";

interface Params {
  date: string;
}

interface HabitsInfo {
  possibleHabits: Array<{
    id: string;
    title: string;
    created_at: string;
  }>;
  completedHabits: string[];
}

export const Habit = () => {
  const [loading, setLoading] = useState(true);
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>({} as HabitsInfo);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);

  const route = useRoute();
  const { date } = route.params as Params;

  const habitProgress = habitsInfo?.possibleHabits?.length
    ? generateProgressPercentage(
        completedHabits.length,
        habitsInfo.possibleHabits.length
      )
    : 0;

  console.log(habitProgress);

  const parsedDate = dayjs(date);
  const isDateInPast = parsedDate.endOf("day").isBefore(new Date());
  const dayOfWeek = parsedDate.format("dddd");
  const dayAndMonth = parsedDate.format("DD/MM");

  async function fetchHabits() {
    try {
      setLoading(true);

      const response = await api.get("/day", { params: { date } });

      setHabitsInfo(response.data);
      setCompletedHabits(response.data.completedHabits);
    } catch (err) {
      console.log(err);
      Alert.alert(
        "Ops!",
        "Ocorreu um problema ao buscar os hábitos neste dia."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleHabit(habitId: string) {
    try {
      await api.patch(`/habits/${habitId}/toggle`);

      if (completedHabits.includes(habitId)) {
        setCompletedHabits((prevState) =>
          prevState.filter((id) => id !== habitId)
        );
      } else {
        setCompletedHabits((prevState) => [...prevState, habitId]);
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Ops!", "Ocorreu um problema ao atualizar o hábito.");
    }
  }

  useEffect(() => {
    fetchHabits();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />
        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>

        <Text className="mt-6 text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>
        <ProgressBar progress={habitProgress} />

        <View
          className={clsx("mt-6", {
            "opacity-50": isDateInPast,
          })}
        >
          {habitsInfo?.possibleHabits?.length > 0 ? (
            habitsInfo.possibleHabits.map((habit) => (
              <Checkbox
                key={habit.id}
                checked={completedHabits.includes(habit.id)}
                title={habit.title}
                disabled={isDateInPast}
                onPress={() => handleToggleHabit(habit.id)}
              />
            ))
          ) : (
            <EmptyHabits />
          )}
        </View>

        {isDateInPast && (
          <Text className="text-gray-400 mt-10 text-center">
            Você não pode editar hábitos de uma data passada
          </Text>
        )}
      </ScrollView>
    </View>
  );
};
