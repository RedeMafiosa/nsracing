import { createClient } from "@base44/sdk";
import { appParams } from "@/lib/app-params";

export const base44 = createClient({
  appId: appParams.appId,
  functionsVersion: appParams.functionsVersion,
  appBaseUrl: appParams.appBaseUrl,
  requiresAuth: false,
});

// 🔥 helper central para sempre usar token atual
export const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("base44_token");
};

// 🔥 interceptor simples (FORÇA token sempre atualizado)
base44.auth.getToken = getAuthToken;

// 🔥 sync login/logout
base44.auth.onAuthChange?.((session) => {
  if (session?.access_token) {
    localStorage.setItem("base44_token", session.access_token);
  } else {
    localStorage.removeItem("base44_token");
  }
});
