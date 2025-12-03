import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

export default function ProtectedRoute({ children }: any) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (!user) return setIsAdmin(false);

      const adminSnap = await getDoc(doc(db, "admins", user.uid));
      setIsAdmin(adminSnap.exists());
    });
  }, []);

  if (isAdmin === null) return <p>Loading...</p>;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}
