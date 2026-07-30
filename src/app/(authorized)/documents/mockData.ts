import { Document } from "./types";

const mockData: Document[] = [
  {
    id: "1",
    name: "quarterly-report.pdf",
    type: "text",
    extension: "pdf",
    size: 2_400_000,
    createdAt: "2026-01-12",
  },
  {
    id: "2",
    name: "meeting-notes.txt",
    type: "text",
    extension: "txt",
    size: 4_200,
    createdAt: "2026-02-03",
  },
  {
    id: "3",
    name: "annual-budget.xlsx",
    type: "spreadsheet",
    extension: "xlsx",
    size: 118_000,
    createdAt: "2026-02-20",
  },
  {
    id: "4",
    name: "team-photo.png",
    type: "image",
    extension: "png",
    size: 5_600_000,
    createdAt: "2026-03-01",
  },
  {
    id: "5",
    name: "offer-template.docx",
    type: "text",
    extension: "docx",
    size: 86_000,
    createdAt: "2026-03-15",
  },
];

export default mockData;
