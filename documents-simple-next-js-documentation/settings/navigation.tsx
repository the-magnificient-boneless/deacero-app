import { PageRoutes } from "@/lib/pageroutes";

export const Navigations = [
  {
    title: "Docs",
    href: `/docs${PageRoutes[0].href}`,
  },
  {
    title: "Swagger",
    href: "http://localhost:5000/api/v0/docs/",
    external: true,
  },
];

export const GitHubLink = {
  href: "https://github.com/the-magnificient-boneless/deacero-app",
};
