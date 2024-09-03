import { ReactNode } from 'react';
import { Settings, HelpCircle } from "lucide-react";

export interface DropdownItem {
  label: string;
  key: string;
  description: string;
  icon: ReactNode;
}

export const DropdownItems = [
  { label: 'My Settings', href: '/settings', icon: Settings },
];

export const NavbarItemsNoDropdown = [
  { 
    label: 'Technology', 
    href: '/additionals',
    description: "Real-time metrics to debug issues. Slow query added? We’ll show you exactly where.", 
  },
  { 
    label: 'Resource', 
    href: '/additionals',
    description: "Real-time metrics to debug issues. Slow query added? We’ll show you exactly where.", 
  },
  { 
    label: 'Price', 
    href: '/additionals',
    description: "Real-time metrics to debug issues. Slow query added? We’ll show you exactly where.", 
  },
];

export const NavbarItemsDropdown = {
  Features: [
    {
      label: "Autoscaling",
      key: "autoscaling",
      description: "ACME scales apps to meet user demand, automagically, based on load.",
      icon: "autoscaling",
    },
    {
      label: "Usage Metrics",
      key: "usage_metrics",
      description: "Real-time metrics to debug issues. Slow query added? We’ll show you exactly where.",
      icon: "usageMetrics",
    },
    {
      label: "Production Ready",
      key: "production_ready",
      description: "ACME runs on ACME, join us and others serving requests at web scale.",
      icon: "productionReady",
    },
    {
      label: "+99% Uptime",
      key: "99_uptime",
      description: "Applications stay on the grid with high availability and high uptime guarantees.",
      icon: "uptime",
    },
    {
      label: "Supreme Support",
      key: "supreme_support",
      description: "Overcome any challenge with a supporting team ready to respond.",
      icon: "support",
    },
    {
      label: "Security",
      key: "security",
      description: "Overcome any challenge with a supporting team ready to respond.",
      icon: "security",
    },
  ],
  Customers: [
    {
      label: "Autoscaling",
      key: "autoscaling",
      description: "ACME scales apps to meet user demand, automagically, based on load.",
      icon: "autoscaling",
    },
    {
      label: "Usage Metrics",
      key: "usage_metrics",
      description: "Real-time metrics to debug issues. Slow query added? We’ll show you exactly where.",
      icon: "usageMetrics",
    },
    {
      label: "Production Ready",
      key: "production_ready",
      description: "ACME runs on ACME, join us and others serving requests at web scale.",
      icon: "productionReady",
    },
    {
      label: "+99% Uptime",
      key: "99_uptime",
      description: "Applications stay on the grid with high availability and high uptime guarantees.",
      icon: "uptime",
    },
    {
      label: "Supreme Support",
      key: "supreme_support",
      description: "Overcome any challenge with a supporting team ready to respond.",
      icon: "support",
    },
    {
      label: "Security",
      key: "security",
      description: "Overcome any challenge with a supporting team ready to respond.",
      icon: "security",
    },
  ],
  Integrations: [
    {
      label: "Autoscaling",
      key: "autoscaling",
      description: "ACME scales apps to meet user demand, automagically, based on load.",
      icon: "autoscaling",
    },
    {
      label: "Usage Metrics",
      key: "usage_metrics",
      description: "Real-time metrics to debug issues. Slow query added? We’ll show you exactly where.",
      icon: "usageMetrics",
    },
    {
      label: "Production Ready",
      key: "production_ready",
      description: "ACME runs on ACME, join us and others serving requests at web scale.",
      icon: "productionReady",
    },
    {
      label: "+99% Uptime",
      key: "99_uptime",
      description: "Applications stay on the grid with high availability and high uptime guarantees.",
      icon: "uptime",
    },
    {
      label: "Supreme Support",
      key: "supreme_support",
      description: "Overcome any challenge with a supporting team ready to respond.",
      icon: "support",
    },
    {
      label: "Security",
      key: "security",
      description: "Overcome any challenge with a supporting team ready to respond.",
      icon: "security",
    },
  ],
};

