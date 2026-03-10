"use client";

import { authClient } from "@/lib/auth-client";

export default function Login() {

  const login = async () => {
    const { data, error } = await authClient.signIn.email({
      email: "test@gmail.com",
      password: "123456"
    });

    console.log(data);
  };

  return (
    <button onClick={login}>
      Login
    </button>
  );
}