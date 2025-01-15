import { Paths } from "@/lib/pageroutes";

export const Documents: Paths[] = [
  {
    title: "Introduction",
    href: "/introduction",
    heading: "Getting started",
    items: [
      {
        title: "Installation",
        href: "/installation",
      },
      {
        title: "Setup",
        href: "/setup",
      },
      {
        title: "Changelog",
        href: "/changelog",
      },
    ],
  },
  {
    spacer: true,
  },
  {
    title: "General Information",
    href: "/general-information",
    heading: "API",
    items: [
      {
        title: "Prerequisites",
        href: "/prerequisites",
      },
    ],
  },
  {
    title: "Usage",
    href: "/usage",
    items: [
      {
        title: "Swagger",
        href: "/swagger",
        items: [
          {
            title: "Endpoint",
            href: "/endpoint",
          },
          {
            title: "Security",
            href: "/security",
          },
        ],
      },
      {
        title: "Postman collection",
        href: "/postman-collection",
      },
    ],
  },
  {
    title: "Monitoring",
    href: "/monitoring",
    items: [
      {
        title: "Grafana",
        href: "/grafana",
      },
      {
        title: "Winston/Prometheus",
        href: "/logs",
      },
    ],
  },
  {
    title: "Database",
    href: "/database",
    items: [
      {
        title: "Overview",
        href: "/overview",
      },
      {
        title: "Mongo Express",
        href: "/mongo-express",
      },
      {
        title: "Schema Definition",
        href: "/schema-definition",
      },
      {
        title: "Security",
        href: "/security",
      },
    ],
  },
  {
    spacer: true,
  },
  {
    title: "Navigation",
    href: "/navigation",
    heading: "About this documentation",
  },
  {
    title: "Structure",
    href: "/structure",
    items: [
      {
        title: "Deeper",
        href: "/deeper",
        items: [
          {
            title: "Even deeper",
            href: "/even-deeper",
          },
        ],
      },
    ],
  },
  {
    title: "Markup",
    href: "/markup",
    heading: "Components",
    items: [
      {
        title: "Cards",
        href: "/cards",
      },
      {
        title: "Diagrams",
        href: "/diagrams",
      },
      {
        title: "Filetree",
        href: "/filetree",
      },
      {
        title: "Lists",
        href: "/lists",
      },
      {
        title: "Maths",
        href: "/maths",
      },
      {
        title: "Notes",
        href: "/notes",
      },
      {
        title: "Steps",
        href: "/steps",
      },
      {
        title: "Table",
        href: "/table",
      },
      {
        title: "Tabs",
        href: "/tabs",
      },
    ],
  },
];
