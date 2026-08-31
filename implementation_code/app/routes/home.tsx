import type { Route } from "./+types/home";
import { Link } from "react-router";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <>
      <Welcome />
      <section className="mx-auto mb-12 max-w-2xl rounded-3xl border border-gray-200 p-6 text-center dark:border-gray-700">
        <h2 className="mb-2 text-xl font-semibold">Ontology validation slice</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-200">
          Validate JSON-LD graph payloads through the SHACL-compatible server route.
        </p>
        <Link className="text-blue-700 hover:underline dark:text-blue-500" to="/validator">
          Open ontology validator
        </Link>
      </section>
    </>
  );
}
