import { useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Profile() {
  const auth = getAuth();

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  const navigate = useNavigate();

  const logout = () => {
    auth.signOut();
    navigate("/");
  };

  return (
    <section className="mt-4">
      <header className="w-full flex items-center justify-between">
        <p className="text-2xl font-bold ml-16 md:ml-48">My Profile</p>
        <button
          type="button"
          className="mr-12 md:mr-32 px-4 py-1 bg-secondary hover:bg-transparent rounded-lg text-primary font-bold "
          onClick={logout}
        >
          Logout
        </button>
      </header>
    </section>
  );
}
export default Profile;
