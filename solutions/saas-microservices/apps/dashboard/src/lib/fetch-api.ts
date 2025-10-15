import { cookies, headers } from "next/headers";

export async function fetchApi<T>(path: string): Promise<T> {
  const reqHeaders = await headers();
  const host = reqHeaders.get("host");
  const isLocalhost = !host || host.includes("localhost");
  const cookieStore = await cookies();
  const response = await fetch(
    `${isLocalhost ? "http://localhost:3024" : "https://saas-microservices-dashboard.vercel.app"}${path}`,
    {
      headers: {
        Cookie: `saas_microservices_authed_user=${cookieStore.get("saas_microservices_authed_user")?.value}`,
      },
    },
  );
  return response.json() as Promise<T>;
}
