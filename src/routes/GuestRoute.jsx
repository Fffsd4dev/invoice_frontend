import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/context/useAuthContext";

export default function GuestRoute({ children }) {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Navigate to="/dashboard/analytics" replace />;
  }

  return children;
}
