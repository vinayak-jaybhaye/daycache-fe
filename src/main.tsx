import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { ThemeProvider } from "./components/theme-provider";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <ThemeProvider defaultTheme="system">
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </GoogleOAuthProvider>
);
