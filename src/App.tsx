import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import TicketsPage from "./pages/TicketsPage";
import TicketDetailPage from "./pages/TicketDetailPage";
import UsersPage from "./pages/UsersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import { useAuthStore } from "./store/authStore";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const token = useAuthStore(
    (state) => state.token
  );

  return (
    <Routes>

      {/* PUBLIC */}
      <Route
        path="/login"
        element={
          token ? (
            <Navigate
              to="/"
              replace
            />
          ) : (
            <LoginPage />
          )
        }
      />

      {/* PROTECTED */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>

          {/* DASHBOARD */}
          <Route
            path="/"
            element={<DashboardPage />}
          />

          {/* ALL TICKETS */}
          <Route
            path="/tickets"
            element={
              <TicketsPage scope="all" />
            }
          />

          {/* MY TICKETS */}
          <Route
            path="/my-tickets"
            element={
              <TicketsPage scope="mine" />
            }
          />

          {/* TICKET DETAIL */}
          <Route
            path="/tickets/:id"
            element={<TicketDetailPage />}
          />

          {/* USERS */}
          <Route
            path="/users"
            element={<UsersPage />}
          />

          {/* ANALYTICS */}
          <Route
            path="/analytics"
            element={<AnalyticsPage />}
          />
        {/* PROFILE */}
        <Route
          path="/profile"
          element={<ProfilePage />}
        />
        </Route>
      </Route>

      {/* FALLBACK */}
      <Route
        path="*"
        element={
          <Navigate
            to={
              token
                ? "/"
                : "/login"
            }
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;