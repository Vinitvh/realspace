import { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { toast } from "react-toastify";

function Profile() {
  const auth = getAuth();
  const [changeDetails, setChangeDetails] = useState(false);
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

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // Update display name in fb
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // Update in firestore
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, { name });
      }
    } catch (error) {
      toast.error("Could not update your profile");
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
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

      <main role="main" className="mt-8">
        <div className="w-96 h-auto mx-auto flex items-center justify-between">
          <p>Personal Details</p>
          <p
            className="text-primary font-bold cursor-pointer"
            onClick={() => {
              changeDetails && onSubmit();
              setChangeDetails((prevState) => !prevState);
            }}
          >
            {changeDetails ? "done" : "Change"}
          </p>
        </div>
        <div className="w-96 mx-auto mt-8">
          <form>
            <input
              type="text"
              id="name"
              className={!changeDetails ? "profileName" : "profileNameActive"}
              disabled={!changeDetails}
              value={name}
              onChange={onChange}
            />
            <input
              type="text"
              id="email"
              className={!changeDetails ? "profileName" : "profileEmailActive"}
              disabled={!changeDetails}
              value={email}
              onChange={onChange}
            />
          </form>
        </div>
        <div className="mt-12 flex items-center justify-center">
          <Link to="/create-listing">
            <p className="flex items-center bg-secondary px-3 py-1 rounded-lg text-primary font-bold">
              Sell or Rent your home <FiArrowRight className="ml-2"/>
            </p>
          </Link>
        </div>
      </main>
    </section>
  );
}
export default Profile;
