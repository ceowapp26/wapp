import React from "react";

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "NAME", uid: "name", sortable: true },
  { name: "CATEGORY", uid: "category", sortable: true },
  { name: "DESCRIPTION", uid: "description" },
  { name: "PRICE", uid: "price", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Paused", uid: "paused" },
  { name: "In Progress", uid: "in_progress" },
];

const products = [
  {
    id: 1,
    name: "Project Management App",
    category: "Productivity",
    description: "Track tasks, deadlines, and team progress.",
    price: "$29.99/month",
    status: "active",
  },
  {
    id: 2,
    name: "Expense Tracking App",
    category: "Finance",
    description: "Manage expenses, budgets, and receipts.",
    price: "$19.99/month",
    status: "paused",
  },
  {
    id: 3,
    name: "CRM System",
    category: "Sales",
    description: "Manage customer relationships and sales pipelines.",
    price: "$49.99/month",
    status: "active",
  },
  {
    id: 4,
    name: "Project Collaboration Tool",
    category: "Development",
    description: "Coordinate tasks, share files, and communicate.",
    price: "$39.99/month",
    status: "in_progress",
  },
];

export { columns, products, statusOptions };
