interface SeedData {
  entries: SeedEntry[];
}

interface SeedEntry {
  description: string;
  status: string;
  createdAt: number;
}

export const seedData: SeedData = {
  entries: [
    {
      description: "Pendiente: lorem ipsum",
      status: "pending",
      createdAt: Date.now(),
    },
    {
      description: "En progreso: lorem ricous",
      status: "in-progress",
      createdAt: Date.now() - 10000000,
    },
    {
      description: "Terminada: taka taka",
      status: "finished",
      createdAt: Date.now() - 100000,
    },
  ],
};
