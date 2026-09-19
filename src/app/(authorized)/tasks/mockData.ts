import { addDaysISO } from "@/utils/isoDate";

import { Task } from "./types";

// TODO: Replace with actual data from the API.
// `createdAt` is generated relative to today so the dashboard stays current.
const today = new Date();

const mockData: Task[] = [
  {
    id: "1",
    name: "Onboarding",
    description: "Introduction workflow for newly hired employees.",
    stepsCount: 6,
    createdAt: addDaysISO(today, -70),
  },
  {
    id: "2",
    name: "Compliance training",
    description: "Mandatory annual compliance and safety training.",
    stepsCount: 4,
    createdAt: addDaysISO(today, -64),
  },
  {
    id: "3",
    name: "Equipment setup",
    description: "Configure laptop, accounts and access for a new workstation.",
    stepsCount: 8,
    createdAt: addDaysISO(today, -58),
  },
  {
    id: "4",
    name: "Performance review",
    description: "Quarterly self-assessment and manager feedback process.",
    stepsCount: 3,
    createdAt: addDaysISO(today, -50),
  },
  {
    id: "5",
    name: "Offboarding",
    description: "Return of equipment and revocation of access on departure.",
    stepsCount: 5,
    createdAt: addDaysISO(today, -42),
  },
  {
    id: "6",
    name: "Security awareness",
    description: "Phishing recognition and incident reporting walkthrough.",
    stepsCount: 4,
    createdAt: addDaysISO(today, -33),
  },
  {
    id: "7",
    name: "Benefits enrollment",
    description: "Guide employees through selecting health and benefits plans.",
    stepsCount: 6,
    createdAt: addDaysISO(today, -21),
  },
  {
    id: "8",
    name: "Mentorship pairing",
    description: "Match new hires with mentors and schedule intro sessions.",
    stepsCount: 3,
    createdAt: addDaysISO(today, -9),
  },
];

export default mockData;
