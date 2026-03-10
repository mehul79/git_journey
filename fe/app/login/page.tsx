"use client";

import { authClient } from "@/lib/auth-client";

export default function GithubLogin() {

  const login = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "http://localhost:3000"
    });
  };

  return (
    <button onClick={login} className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
      Login with GitHub
    </button>
  );
}