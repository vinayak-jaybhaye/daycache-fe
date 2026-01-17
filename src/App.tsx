import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";

import { Home, Login, Signup, Settings, ForgotPassword } from "@/pages";
import { ProtectedRoute, PublicOnlyRoute, Day, SearchEntries, MainLayout, ActivityLayout } from "@/components";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Wrap protected and public routes in Layout */}
      <Route>
        {/* Protected routes */}
        <Route element={<MainLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />}>
              <Route path="/day" />
              <Route path="day/:date" element={<Day />} />
            </Route>

            <Route path="/open/:date" element={<Day />} />

            <Route path="search" element={<SearchEntries />} />
            <Route path="activity" element={<ActivityLayout />} >

              <Route path="day/:date" element={<Day />} />
            </Route>
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Public routes */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
