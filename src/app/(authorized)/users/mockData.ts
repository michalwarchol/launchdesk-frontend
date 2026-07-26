import { User } from "./types";

const mockData: User[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@michalwarchol.com",
    role: "admin",
    avatar: "https://i.pravatar.cc/150?img=11",
    createdAt: "2021-01-01",
    updatedAt: "2021-01-01",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@michalwarchol.com",
    role: "user",
    avatar: "https://i.pravatar.cc/150?img=12",
    createdAt: "2021-01-01",
    updatedAt: "2021-01-01",
  },
];

export default mockData;
