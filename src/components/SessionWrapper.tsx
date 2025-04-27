"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";

const SessionWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider basePath="/ddcg/account/api/auth">
      {children}
    </SessionProvider>
  );
};

export default SessionWrapper;
