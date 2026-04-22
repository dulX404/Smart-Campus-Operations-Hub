import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./common/Toast";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
