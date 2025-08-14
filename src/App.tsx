import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { Home, Login, Signup, Profile, Settings } from "./pages";
import { Layout, CalendarView } from "./components";
import DayCacheChat from "./components/DayCacheChat";
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Wrap protected and public routes in Layout */}
      <Route element={<Layout />}>
        {/* Protected routes */}
        <Route path="/" element={<Home />} />
        <Route path="/day/:queryDate" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/calendar-view" element={<CalendarView />} />
        <Route path="/cache-chat" element={<DayCacheChat/>} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
    </>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
