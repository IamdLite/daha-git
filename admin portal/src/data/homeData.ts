// src/data/homeData.ts
export interface ChartData {
  title: string;
  number: number | string;
  percentage?: number;
  color?: string;
  chartData: { name: string; value: number }[];
  chartPieData?: Array<{ name: string; value: number; color: string }>;
  chartAreaData?: Array<{
    name: string;
    smartphones: number;
    consoles: number;
    laptops: number;
    others: number;
  }>;
  dataKey: string;
}

export const homeData = {
  totalUsers: {
    title: "Total Users",
    number: "11,245",
    percentage: 12,
    color: "#8884d8",
    chartData: [
      { name: "Sun", value: 400 },
      { name: "Mon", value: 600 },
      // ... rest of the data
    ],
    dataKey: "value"
  },
  totalCourses: {
    title: "Total Courses",
    number: 83,
    percentage: 8,
    color: "#82ca9d",
    chartData: [
      { name: "Sun", value: 20 },
      // ... rest of the data
    ],
    dataKey: "value"
  },
  leadsBySource: {
    title: "Leads by Source",
    number: "1,402",
    color: "#ffc658",
    chartPieData: [
      { name: "Mobile", value: 400, color: "#8884d8" },
      { name: "Desktop", value: 300, color: "#82ca9d" },
      { name: "Tablet", value: 200, color: "#ffc658" },
      { name: "Other", value: 100, color: "#ff8042" }
    ],
    dataKey: "value"
  },
  revenueByProducts: {
    title: "Revenue by Products",
    number: "$42,430",
    chartAreaData: [
      { name: "Jan", smartphones: 4000, consoles: 2400, laptops: 2400, others: 1000 },
      // ... rest of the data
    ],
    dataKey: "value"
  },
  // ... include all other chart data objects
};