import { Assignment } from "./types";

// TODO: Replace with actual data from the API
const mockData: Assignment[] = [
  {
    id: "1",
    taskId: "1",
    taskName: "Onboarding",
    assignees: [
      { id: "1", firstName: "John", lastName: "Doe", avatar: "https://i.pravatar.cc/150?img=11" },
      { id: "2", firstName: "Jane", lastName: "Smith", avatar: "https://i.pravatar.cc/150?img=12" },
      { id: "3", firstName: "Alex", lastName: "Nowak", avatar: "https://i.pravatar.cc/150?img=13" },
      {
        id: "4",
        firstName: "Maria",
        lastName: "Garcia",
        avatar: "https://i.pravatar.cc/150?img=14",
      },
      { id: "5", firstName: "Tom", lastName: "Brown", avatar: "https://i.pravatar.cc/150?img=15" },
      {
        id: "6",
        firstName: "Emma",
        lastName: "Wilson",
        avatar: "https://i.pravatar.cc/150?img=16",
      },
      {
        id: "7",
        firstName: "Lucas",
        lastName: "Kowalski",
        avatar: "https://i.pravatar.cc/150?img=17",
      },
    ],
    progress: 0.65,
    createdAt: "2026-01-12",
  },
  {
    id: "2",
    taskId: "2",
    taskName: "Compliance training",
    assignees: [
      { id: "2", firstName: "Jane", lastName: "Smith", avatar: "https://i.pravatar.cc/150?img=12" },
      {
        id: "8",
        firstName: "Olivia",
        lastName: "Taylor",
        avatar: "https://i.pravatar.cc/150?img=18",
      },
      {
        id: "9",
        firstName: "Noah",
        lastName: "Anderson",
        avatar: "https://i.pravatar.cc/150?img=19",
      },
    ],
    progress: 1,
    createdAt: "2026-01-29",
  },
  {
    id: "3",
    taskId: "3",
    taskName: "Equipment setup",
    assignees: [
      {
        id: "10",
        firstName: "Sophia",
        lastName: "Martinez",
        avatar: "https://i.pravatar.cc/150?img=20",
      },
    ],
    progress: 0,
    createdAt: "2026-02-15",
  },
  {
    id: "4",
    taskId: "4",
    taskName: "Performance review",
    assignees: [
      { id: "1", firstName: "John", lastName: "Doe", avatar: "https://i.pravatar.cc/150?img=11" },
      { id: "11", firstName: "Ethan", lastName: "Lewandowski" },
    ],
    progress: 0.3,
    createdAt: "2026-03-03",
  },
  {
    id: "5",
    taskId: "5",
    taskName: "Offboarding",
    assignees: [
      { id: "3", firstName: "Alex", lastName: "Nowak", avatar: "https://i.pravatar.cc/150?img=13" },
      {
        id: "4",
        firstName: "Maria",
        lastName: "Garcia",
        avatar: "https://i.pravatar.cc/150?img=14",
      },
      { id: "5", firstName: "Tom", lastName: "Brown", avatar: "https://i.pravatar.cc/150?img=15" },
      {
        id: "6",
        firstName: "Emma",
        lastName: "Wilson",
        avatar: "https://i.pravatar.cc/150?img=16",
      },
    ],
    progress: 0.5,
    createdAt: "2026-03-21",
  },
];

export default mockData;
