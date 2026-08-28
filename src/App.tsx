import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import { useAuthStore } from "./store/authStore";
import TicketsPage from "./pages/TicketsPage";
import TicketDetailPage from "./pages/TicketDetailPage";
import UsersPage from "./pages/UsersPage";

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
    <Route
      path="/"
      element={<DashboardPage />}
    />

    <Route
      path="/tickets"
      element={<TicketsPage />}
    />

    <Route
      path="/tickets/:id"
      element={<TicketDetailPage />}
    />

    <Route
      path="/my-tickets"
      element={
        <div className="p-6">
          My Tickets
        </div>
      }
    />

<Route
  path="/users"
  element={<UsersPage />}
/>

    <Route
      path="/analytics"
      element={
        <div className="p-6">
          Analytics
        </div>
      }
    />
  </Route>
</Route>

      {/* FALLBACK */}
      <Route
        path="*"
        element={
          <Navigate
            to={token ? "/" : "/login"}
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;