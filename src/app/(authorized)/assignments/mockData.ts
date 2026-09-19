import { addDaysISO } from "@/utils/isoDate";

import { Assignment, AssignmentAssignee } from "./types";

// TODO: Replace with actual data from the API.
// Dates are generated relative to today so the dashboard stays current.
const today = new Date();

const people: AssignmentAssignee[] = [
  { id: "1", firstName: "John", lastName: "Doe", avatar: "https://i.pravatar.cc/150?img=11" },
  { id: "2", firstName: "Jane", lastName: "Smith", avatar: "https://i.pravatar.cc/150?img=12" },
  { id: "3", firstName: "Alex", lastName: "Nowak", avatar: "https://i.pravatar.cc/150?img=13" },
  { id: "4", firstName: "Maria", lastName: "Garcia", avatar: "https://i.pravatar.cc/150?img=14" },
  { id: "5", firstName: "Tom", lastName: "Brown", avatar: "https://i.pravatar.cc/150?img=15" },
  { id: "6", firstName: "Emma", lastName: "Wilson", avatar: "https://i.pravatar.cc/150?img=16" },
  { id: "7", firstName: "Lucas", lastName: "Kowalski", avatar: "https://i.pravatar.cc/150?img=17" },
  { id: "8", firstName: "Olivia", lastName: "Taylor", avatar: "https://i.pravatar.cc/150?img=18" },
  { id: "9", firstName: "Noah", lastName: "Anderson", avatar: "https://i.pravatar.cc/150?img=19" },
  {
    id: "10",
    firstName: "Sophia",
    lastName: "Martinez",
    avatar: "https://i.pravatar.cc/150?img=20",
  },
  {
    id: "11",
    firstName: "Ethan",
    lastName: "Lewandowski",
    avatar: "https://i.pravatar.cc/150?img=21",
  },
  { id: "12", firstName: "Jan", lastName: "Kowalczyk", avatar: "https://i.pravatar.cc/150?img=22" },
];

const peopleById = new Map(people.map((person) => [person.id, person]));

const assignees = (ids: string[]): AssignmentAssignee[] =>
  ids
    .map((id) => peopleById.get(id))
    .filter((person): person is AssignmentAssignee => Boolean(person));

interface Row {
  taskId: string;
  taskName: string;
  assigneeIds: string[];
  progress: number;
  createdOffset: number;
  dueOffset: number;
  completedOffset?: number;
}

const rows: Row[] = [
  // Completed assignments (progress === 1), spread across the last ~5 months.
  {
    taskId: "2",
    taskName: "Compliance training",
    assigneeIds: ["2", "8", "9"],
    progress: 1,
    createdOffset: -168,
    dueOffset: -150,
    completedOffset: -152,
  },
  {
    taskId: "1",
    taskName: "Onboarding",
    assigneeIds: ["1", "2", "3", "4", "5", "6", "7"],
    progress: 1,
    createdOffset: -160,
    dueOffset: -140,
    completedOffset: -141,
  },
  {
    taskId: "3",
    taskName: "Equipment setup",
    assigneeIds: ["10"],
    progress: 1,
    createdOffset: -150,
    dueOffset: -120,
    completedOffset: -121,
  },
  {
    taskId: "4",
    taskName: "Performance review",
    assigneeIds: ["1", "11"],
    progress: 1,
    createdOffset: -140,
    dueOffset: -110,
    completedOffset: -108,
  },
  {
    taskId: "5",
    taskName: "Offboarding",
    assigneeIds: ["3", "4", "5", "6"],
    progress: 1,
    createdOffset: -132,
    dueOffset: -100,
    completedOffset: -98,
  },
  {
    taskId: "6",
    taskName: "Security awareness",
    assigneeIds: ["2", "5", "7", "9"],
    progress: 1,
    createdOffset: -120,
    dueOffset: -90,
    completedOffset: -88,
  },
  {
    taskId: "1",
    taskName: "Onboarding",
    assigneeIds: ["8", "9", "10", "11"],
    progress: 1,
    createdOffset: -110,
    dueOffset: -80,
    completedOffset: -79,
  },
  {
    taskId: "7",
    taskName: "Benefits enrollment",
    assigneeIds: ["4", "6", "12"],
    progress: 1,
    createdOffset: -100,
    dueOffset: -70,
    completedOffset: -68,
  },
  {
    taskId: "2",
    taskName: "Compliance training",
    assigneeIds: ["1", "3", "5", "7", "11"],
    progress: 1,
    createdOffset: -90,
    dueOffset: -55,
    completedOffset: -54,
  },
  {
    taskId: "8",
    taskName: "Mentorship pairing",
    assigneeIds: ["2", "10"],
    progress: 1,
    createdOffset: -75,
    dueOffset: -40,
    completedOffset: -38,
  },
  // Overdue assignments (progress < 1, due date already passed).
  {
    taskId: "4",
    taskName: "Performance review",
    assigneeIds: ["6", "7", "8"],
    progress: 0.6,
    createdOffset: -60,
    dueOffset: -10,
  },
  {
    taskId: "3",
    taskName: "Equipment setup",
    assigneeIds: ["11", "12"],
    progress: 0.2,
    createdOffset: -45,
    dueOffset: -4,
  },
  {
    taskId: "6",
    taskName: "Security awareness",
    assigneeIds: ["1", "4", "9"],
    progress: 0.45,
    dueOffset: -1,
    createdOffset: -40,
  },
  // In-progress assignments, due in the future.
  {
    taskId: "1",
    taskName: "Onboarding",
    assigneeIds: ["5", "6", "7", "8"],
    progress: 0.3,
    createdOffset: -35,
    dueOffset: 6,
  },
  {
    taskId: "5",
    taskName: "Offboarding",
    assigneeIds: ["2", "3"],
    progress: 0.7,
    createdOffset: -30,
    dueOffset: 9,
  },
  {
    taskId: "7",
    taskName: "Benefits enrollment",
    assigneeIds: ["1", "10", "11", "12"],
    progress: 0.5,
    createdOffset: -28,
    dueOffset: 12,
  },
  {
    taskId: "2",
    taskName: "Compliance training",
    assigneeIds: ["4", "5", "6"],
    progress: 0.15,
    createdOffset: -22,
    dueOffset: 18,
  },
  {
    taskId: "8",
    taskName: "Mentorship pairing",
    assigneeIds: ["7", "9", "11"],
    progress: 0.8,
    createdOffset: -18,
    dueOffset: 20,
  },
  {
    taskId: "3",
    taskName: "Equipment setup",
    assigneeIds: ["1", "2", "12"],
    progress: 0.35,
    createdOffset: -14,
    dueOffset: 25,
  },
  {
    taskId: "4",
    taskName: "Performance review",
    assigneeIds: ["3", "8", "10"],
    progress: 0.55,
    createdOffset: -10,
    dueOffset: 31,
  },
  // Not started assignments (progress === 0).
  {
    taskId: "1",
    taskName: "Onboarding",
    assigneeIds: ["9", "10"],
    progress: 0,
    createdOffset: -7,
    dueOffset: 38,
  },
  {
    taskId: "6",
    taskName: "Security awareness",
    assigneeIds: ["2", "5", "11", "12"],
    progress: 0,
    createdOffset: -5,
    dueOffset: 44,
  },
  {
    taskId: "5",
    taskName: "Offboarding",
    assigneeIds: ["6", "7"],
    progress: 0,
    createdOffset: -2,
    dueOffset: 52,
  },
];

const mockData: Assignment[] = rows.map((row, index) => ({
  id: `${index + 1}`,
  taskId: row.taskId,
  taskName: row.taskName,
  assignees: assignees(row.assigneeIds),
  progress: row.progress,
  dueDate: addDaysISO(today, row.dueOffset),
  createdAt: addDaysISO(today, row.createdOffset),
  completedAt: row.completedOffset !== undefined ? addDaysISO(today, row.completedOffset) : null,
}));

export default mockData;
