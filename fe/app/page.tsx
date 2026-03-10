"use client";

import { authClient } from "@/lib/auth-client";

export default function Dashboard() {
  const { data: session } = authClient.useSession();

  if (!session) return <div>Not logged in</div>;

  return <div>Hello {session.user.email}</div>;
}