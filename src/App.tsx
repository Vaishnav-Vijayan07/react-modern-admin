import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { RanksProvider } from "./contexts/RanksContext";
import { OfficeTypesProvider } from "./contexts/officeTypesContext";
import { DiaryPdfsProvider } from "./contexts/diaryPdfsContext";
import { UsersProvider } from "./contexts/UsersContext";
import { Toaster } from "@/components/ui/toaster";
import Home from "./components/home";
import LoginForm from "./components/auth/LoginForm";
import RegistrationForm from "./components/auth/RegistrationForm";
import AuthGuard from "./components/auth/AuthGuard";

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
                  <UsersProvider>
                    <OfficeTypesProvider>
                      <RanksProvider>
                        <DiaryPdfsProvider>
                          <Home />
                        </DiaryPdfsProvider>
                      </RanksProvider>
                    </OfficeTypesProvider>
                  </UsersProvider>
                </AuthGuard>
              }
            />
          </Routes>
          <Toaster />
        </>
      </AuthProvider>
    </Suspense>
  );
}

export default App;
