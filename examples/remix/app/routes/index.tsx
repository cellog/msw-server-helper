import type { LoaderArgs } from "@remix-run/node";
import { fetch, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderArgs) => {
  const res = await fetch("http://example.com");
  if (!res.ok) {
    return json({ error: true, text: "" });
  }
  const text = await res.text();

  return json({ error: false, text });
};

export default function Index() {
  const { error, text } = useLoaderData<typeof loader>();

  if (error) {
    return (
      <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
        Error: failed to load
      </main>
    );
  }

  return (
    <main
      className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center"
      dangerouslySetInnerHTML={{
        __html: text,
      }}
    ></main>
  );
}
