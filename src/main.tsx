// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { ThemeProvider } from "./components/theme-provider";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <ThemeProvider defaultTheme="system">
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>
  // </StrictMode>,
);
