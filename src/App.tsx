import { Suspense } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import Home from "./components/home";
import LoginForm from "./components/auth/LoginForm";
import RegistrationForm from "./components/auth/RegistrationForm";
import AuthGuard from "./components/auth/AuthGuard";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AuthProvider>
        <>
          <Routes>
            <Route
              path="/login"
              element={
                <AuthGuard requireAuth={false}>
                  <div className="bg-background min-h-screen p-4 flex items-center justify-center">
                    <LoginForm />
                  </div>
                </AuthGuard>
              }
            />
            <Route
              path="/register"
              element={
                <AuthGuard requireAuth={false}>
                  <div className="bg-background min-h-screen p-4 flex items-center justify-center">
                    <RegistrationForm />
                  </div>
                </AuthGuard>
              }
            />
            <Route
              path="/*"
              element={
                <AuthGuard>
                  <Home />
                </AuthGuard>
              }
            />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
          <Toaster />
        </>
      </AuthProvider>
    </Suspense>
  );
}

export default App;
