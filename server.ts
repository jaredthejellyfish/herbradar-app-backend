import app from "./src/index";
if (import.meta.main) {
  const port = Number(process.env.PORT ?? 3000);

  console.log(`Server is running on port ${port}`);

  Bun.serve({
    port,
    hostname: "0.0.0.0",
    fetch: app.fetch,
  });
}
