import { ProtectedRoute } from "@/shared/ui/ProtectedRoute";
import { AppLayout } from "./AppLayout";
import { LoginForm } from "@/features/auth/components/LoginForm";

function App() {

  return (
    <ProtectedRoute fallback={<LoginForm />}>
      <AppLayout />
    </ProtectedRoute>
  )
}

export default App;
