import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";
import { generateDateFromYearBeginning } from "../utils/generateDateFromYearBeginning";
import { HabitDay } from "./HabitDay";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

const summaryDates = generateDateFromYearBeginning();
const minimumSummaryDatesSize = 18 * 7; // 18 weeks;
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length;

type Summary = {
  id: string;
  date: string;
  amount: number;
  completed: number;
}[];

export function SummaryTable() {
  const [summary, setSummary] = useState<Summary>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    api.get("summary").then((response) => {
      setSummary(response.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <h1>Carregando...</h1>;
  }

  return (
    <div className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekDays.map((weekDay, i) => (
          <div
            key={`${weekDay}-${i}`}
            className="text-zinc-400 text-xl h-10 w-10 flex items-center justify-center"
          >
            {weekDay}
          </div>
        ))}
      </div>
      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {summaryDates.map((date) => {
          const dayInSummary = summary.find((day) => {
            return dayjs(date).isSame(day.date, "day");
          });

          return (
            <HabitDay
              date={date}
              amount={dayInSummary?.amount}
              defaultCompleted={dayInSummary?.completed}
              key={date.toString()}
            />
          );
        })}
        {amountOfDaysToFill > 0 &&
          Array.from({ length: amountOfDaysToFill }).map((_, i) => (
            <div
              key={i}
              className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"
            />
          ))}
      </div>
    </div>
  );
}
