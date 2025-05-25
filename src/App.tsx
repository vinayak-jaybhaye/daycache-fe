import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { Home, Login, Signup, Profile, Settings } from "./pages";
import { Layout, CalendarView } from "./components";
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Wrap protected and public routes in Layout */}
      <Route element={<Layout />}>
        {/* Protected routes */}
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/calendar-view" element={<CalendarView />} />
        {/* <Route path="/journal-archive" element={<JournalArchive />} /> */}
        {/* <Route path="/insights" element={<Insights />} /> */}
        {/* <Route path="/help-support" element={<HelpSupport />} /> */}

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
    </>
  )
);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
