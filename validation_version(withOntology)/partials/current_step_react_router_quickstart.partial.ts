// Reference-only partial.
// The real implementation is in app/root.tsx, app/routes.ts, and app/routes/validator.tsx.

export const reactRouterQuickstartPartial = {
  scripts: ["react-router dev", "react-router build", "react-router-serve ./build/server/index.js"],
  routes: ["/", "/validator"],
  goal: "Expose a server-side SHACL validation route without making partials production code.",
};
