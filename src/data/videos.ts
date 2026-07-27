export type VideoItem = {
  id: string;
  title: string;
  category: "Tutorials" | "Setup" | "AI" | "Monetization";
  dateAdded: string; // ISO
  featured?: boolean;
};

export const videos: VideoItem[] = [
  { id: "v1", title: "Launch your first AI-run channel in 30 minutes", category: "Setup", dateAdded: "2025-07-25", featured: true },
  { id: "v2", title: "Automate 24×7 programming with AI schedules", category: "AI", dateAdded: "2025-07-24", featured: true },
  { id: "v3", title: "Broadcast to Facebook, YouTube and OTT at once", category: "Tutorials", dateAdded: "2025-07-23" },
  { id: "v4", title: "Own your broadcast server — no big datacenter needed", category: "Setup", dateAdded: "2025-07-22" },
  { id: "v5", title: "Monetize your channel with ad slots", category: "Monetization", dateAdded: "2025-07-21" },
  { id: "v6", title: "Push your channel onto local cable TV", category: "Tutorials", dateAdded: "2025-07-20" },
  { id: "v7", title: "AI-generated lower-thirds and graphics", category: "AI", dateAdded: "2025-07-19" },
  { id: "v8", title: "Setting sponsorship rates for your channel", category: "Monetization", dateAdded: "2025-07-18" },
];

export const videoCategories = ["All", "Tutorials", "Setup", "AI", "Monetization"] as const;
