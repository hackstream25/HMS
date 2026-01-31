import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedJudgeRoute() {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/judge/me", {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) setAllowed(true);
        else setAllowed(false);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null; // or spinner
  if (!allowed) return <Navigate to="/judge/login" replace />;

  return <Outlet />;
}
