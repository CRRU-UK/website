export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && process.env.NODE_ENV === "production") {
    await import("pino");
    // @ts-expect-error No declaration file
    await import("next-logger");
  }
}
