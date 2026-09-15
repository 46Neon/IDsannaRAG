Deno.serve(async (req) => {
  if (req.method !== "POST") return Response.json({ error: "method_not_allowed" }, { status: 405 });
  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return Response.json({ error: "missing_auth" }, { status: 401 });
  return Response.json({ ok: false, code: "INGESTION_PIPELINE_NOT_DEPLOYED" }, { status: 501 });
});
