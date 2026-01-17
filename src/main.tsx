import { createRoot } from "react-dom/client";
import "@/index.css";
import App from "@/App.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

import bootstrapTheme from "@/services/bootstrapTheme";
import bootstrapAuth from "@/services/bootstrapAuth";

(async function startApp(){
  bootstrapTheme();
  await bootstrapAuth();

  createRoot(document.getElementById("root")!).render(
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  );
})();