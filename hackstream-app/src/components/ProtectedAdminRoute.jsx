import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedAdminRoute = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/admin/me", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          navigate("/admin/login");
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setAdmin(data);
        setLoading(false);
      })
      .catch(() => {
        navigate("/admin/login");
      });
  }, [navigate]);

  if (loading) return <div className="p-10 text-white">Verifying Access...</div>;

  // We pass the admin data down to all child routes using context
  return <Outlet context={{ admin }} />;
};

export default ProtectedAdminRoute;