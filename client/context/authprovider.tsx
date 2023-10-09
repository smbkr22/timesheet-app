"use client";

import { createContext, useState } from "react";
import { AuthInfo } from "@/types";

export const AuthContext = createContext<{
  auth: AuthInfo | null;
  setAuth: React.Dispatch<React.SetStateAction<AuthInfo | null>>;
}>({
  auth: null,
  setAuth: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [auth, setAuth] = useState<AuthInfo | null>(null);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
