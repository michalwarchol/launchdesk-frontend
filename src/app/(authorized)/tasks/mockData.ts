import { Task } from "./types";

const mockData: Task[] = [
  {
    id: "1",
    name: "Onboarding",
    description: "Introduction workflow for newly hired employees.",
    stepsCount: 6,
    createdAt: "2026-01-10",
  },
  {
    id: "2",
    name: "Compliance training",
    description: "Mandatory annual compliance and safety training.",
    stepsCount: 4,
    createdAt: "2026-01-28",
  },
  {
    id: "3",
    name: "Equipment setup",
    description: "Configure laptop, accounts and access for a new workstation.",
    stepsCount: 8,
    createdAt: "2026-02-14",
  },
  {
    id: "4",
    name: "Performance review",
    description: "Quarterly self-assessment and manager feedback process.",
    stepsCount: 3,
    createdAt: "2026-03-02",
  },
  {
    id: "5",
    name: "Offboarding",
    description: "Return of equipment and revocation of access on departure.",
    stepsCount: 5,
    createdAt: "2026-03-20",
  },
];

export default mockData;
