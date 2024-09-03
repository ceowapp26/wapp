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
  { name: "Developing", uid: "developing" },
];

const products = [
  {
    id: 1,
    name: "WApp-Music",
    category: "Personal",
    description: "Stream and enjoy a diverse range of music, audios, and curated playlists tailored for work and study environments.",
    price: "$_._/month",
    status: "active",
  },
  {
    id: 2,
    name: "WApp-Book",
    category: "Personal",
    description: "Access an extensive library of books for your reading pleasure.",
    price: "$_._/month",
    status: "active",
  },
  {
    id: 3,
    name: "WApp-Doc",
    category: "business",
    description: "Experience an advanced document editor enriched with AI-powered features.",
    price: "$_._/month",
    status: "active",
  },
  {
    id: 4,
    name: "WApp-Portal",
    category: "business",
    description: "Edit text, images, audio, and video seamlessly with AI-enhanced tools.",
    price: "$_._/month",
    status: "active",
  },
  {
    id: 5,
    name: "WApp-Marketing",
    category: "Business",
    description: "Integrated marketing tools with AI-driven insights to enhance your marketing experience.",
    price: "$_._/month",
    status: "developing",
  },
  {
    id: 6,
    name: "WApp-Ecommerce",
    category: "Business",
    description: "Leverage AI-driven insights to optimize your eCommerce strategies and management.",
    price: "$_._/month",
    status: "developing",
  },
];

export { columns, products, statusOptions };

