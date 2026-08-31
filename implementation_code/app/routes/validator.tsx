import { Form, useActionData, useLoaderData } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

import {
  getValidatorReadiness,
  validateOntologySubmission,
} from "~/lib/ontology/validatorRouter.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  return getValidatorReadiness({
    axiomId: url.searchParams.get("axiomId") ?? undefined,
    caseId: url.searchParams.get("caseId") ?? undefined,
  });
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

      <Form className="grid gap-4 rounded-2xl border border-gray-200 p-4 md:grid-cols-3 dark:border-gray-700" method="get">
        <label className="block">
          <span className="font-semibold">Case ID</span>
          <select
            className="mt-1 w-full rounded border border-gray-300 p-2 text-gray-900"
            defaultValue={readiness.filters.caseId}
            name="caseId"
          >
            <option value="">All cases</option>
            {readiness.filterOptions.caseIds.map((caseId) => (
              <option key={caseId} value={caseId}>
                {caseId}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="font-semibold">Axiom ID</span>
          <select
            className="mt-1 w-full rounded border border-gray-300 p-2 text-gray-900"
            defaultValue={readiness.filters.axiomId}
            name="axiomId"
          >
            <option value="">All axioms</option>
            {readiness.filterOptions.axiomIds.map((axiomId) => (
              <option key={axiomId} value={axiomId}>
                {axiomId}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end gap-2">
          <button
            className="rounded bg-gray-900 px-4 py-2 font-semibold text-white hover:bg-black"
            type="submit"
          >
            Filter evidence
          </button>
          <a className="px-2 py-2 text-sm underline" href="/validator">
            Clear
          </a>
        </div>
      </Form>

      <section className="rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
        <h2 className="mb-3 text-xl font-semibold">Before-processing observability</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="p-2">Occurrence</th>
                <th className="p-2">Case</th>
                <th className="p-2">Axiom</th>
                <th className="p-2">Mode</th>
                <th className="p-2">Type</th>
                <th className="p-2">Submitted by</th>
                <th className="p-2">Target</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {readiness.observabilityRows.map((row) => (
                <tr className="border-b border-gray-100 dark:border-gray-800" key={String(row["@id"])}>
                  <td className="p-2 font-semibold">{String(row.occurrence ?? "-")}</td>
                  <td className="p-2">{String(row.caseId ?? "-")}</td>
                  <td className="p-2">{String(row.axiomRef ?? "-")}</td>
                  <td className="p-2">{String(row.ontologyMode ?? "-")}</td>
                  <td className="p-2">{String(row.eventType ?? "-")}</td>
                  <td className="p-2">{String(row.submittedBy ?? "-")}</td>
                  <td className="p-2">{String(row.target ?? "-")}</td>
                  <td className="p-2">{String(row.status ?? "-")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 p-4 dark:border-gray-700">
        <h2 className="mb-3 text-xl font-semibold">Struggling / validation</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="p-2">Occurrence</th>
                <th className="p-2">Case</th>
                <th className="p-2">Axiom</th>
                <th className="p-2">Detailed reasoning</th>
                <th className="p-2">Duration</th>
                <th className="p-2">Tokens</th>
                <th className="p-2">Rule</th>
                <th className="p-2">Errored</th>
              </tr>
            </thead>
            <tbody>
              {readiness.validationRows.map((row) => (
                <tr className="border-b border-gray-100 dark:border-gray-800" key={String(row["@id"])}>
                  <td className="p-2 font-semibold">{String(row.occurrence ?? "-")}</td>
                  <td className="p-2">{String(row.caseId ?? "-")}</td>
                  <td className="p-2">{String(row.axiomRef ?? "-")}</td>
                  <td className="p-2">{String(row.detailedReasoning ?? "-")}</td>
                  <td className="p-2">{String(row.integerDuration ?? "-")}</td>
                  <td className="p-2">{String(row.tokens ?? "-")}</td>
                  <td className="p-2">{String(row.validationRule ?? "-")}</td>
                  <td className="p-2">{String(row.errored ?? false)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
