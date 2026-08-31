import { Form, useActionData, useLoaderData } from "react-router";
import type { ActionFunctionArgs } from "react-router";

import {
  getValidatorReadiness,
  validateOntologySubmission,
} from "~/lib/ontology/validatorRouter.server";

export async function loader() {
  return getValidatorReadiness();
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const payload = formData.get("payload");

  if (typeof payload !== "string" || payload.trim().length === 0) {
    throw new Response("Missing JSON-LD payload", { status: 400 });
  }

  return validateOntologySubmission(payload);
}

export default function ValidatorRoute() {
  const readiness = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <main className="mx-auto max-w-5xl space-y-8 p-6">
      <header>
        <h1 className="text-3xl font-bold">SHACL-compatible ontology validator</h1>
        <p className="mt-2 text-gray-700 dark:text-gray-200">
          This route is the migrated implementation surface for the ontology-governed
          workflow. It keeps reference partials separate from production-compatible
          validation code.
        </p>
      </header>

      <section className="rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
        <h2 className="mb-2 text-xl font-semibold">Readiness</h2>
        <pre className="overflow-x-auto rounded bg-gray-100 p-3 text-sm text-gray-900">
          {JSON.stringify(readiness.boundaries, null, 2)}
        </pre>
      </section>

      <Form className="space-y-4" method="post">
        <label className="block font-semibold" htmlFor="payload">
          JSON-LD payload
        </label>
        <textarea
          className="min-h-96 w-full rounded border border-gray-300 p-3 font-mono text-sm text-gray-900"
          id="payload"
          name="payload"
          defaultValue={readiness.samplePayload}
        />
        <button
          className="rounded bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800"
          type="submit"
        >
          Validate payload
        </button>
      </Form>

      {actionData ? (
        <section className="rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
          <h2 className="mb-2 text-xl font-semibold">Validation result</h2>
          <pre className="overflow-x-auto rounded bg-gray-100 p-3 text-sm text-gray-900">
            {JSON.stringify(actionData, null, 2)}
          </pre>
        </section>
      ) : null}
    </main>
  );
}
