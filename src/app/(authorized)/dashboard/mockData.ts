import { getFormatter } from "next-intl/server";

import assignmentsMockData from "@/app/(authorized)/assignments/mockData";
import tasksMockData from "@/app/(authorized)/tasks/mockData";
import usersMockData from "@/app/(authorized)/users/mockData";

import { buildDashboardStats } from "./stats";
import { DashboardStats } from "./types";

// TODO: Replace with actual data from the API. Swap the body of this function
// for a `fetch` call returning the same `DashboardStats` shape.
export async function getDashboardStats(): Promise<DashboardStats> {
  const format = await getFormatter();
  const now = new Date();

  return buildDashboardStats(
    { assignments: assignmentsMockData, tasks: tasksMockData, users: usersMockData },
    now,
    (date) => format.dateTime(date, { month: "short" }),
  );
}
