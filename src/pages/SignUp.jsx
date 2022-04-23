import { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { Link, useNavigate } from "react-router-dom";
import { FiEye } from "react-icons/fi";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;

  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      updateProfile(auth.currentUser, { displayName: name });

      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy);

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <header>
        <p className="text-2xl font-bold text-center mt-4">Register</p>
      </header>
      <div className="w-80 mx-auto my-12 bg-secondary shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col">
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label
              className="block text-grey-darker text-sm font-bold mb-2"
              htmlFor="email"
            >
              Name
            </label>
            <input
              type="text"
              className="shadow appearance-none rounded w-full py-2 px-3 text-grey-darker"
              id="name"
              value={name}
              placeholder="Your Name"
              required
              onChange={onChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-grey-darker text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              className="shadow appearance-none rounded w-full py-2 px-3 text-grey-darker"
              id="email"
              value={email}
              placeholder="Your email"
              required
              onChange={onChange}
            />
          </div>
          <div className="mb-6 relative">
            <label
              className="block text-grey-darker text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="shadow appearance-none rounded w-full py-2 px-3 text-grey-darker mb-3"
              id="password"
              value={password}
              placeholder="******************"
              required
              onChange={onChange}
            />
            <FiEye
              className="absolute top-10 right-6 cursor-pointer"
              onClick={() => setShowPassword((prevState) => !prevState)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-primary text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Sign Up
            </button>
          </div>
        </form>
        <Link
          to="/sign-in"
          className="text-center mt-4 text-primary hover:underline font-bold"
        >
          Sign In
        </Link>
      </div>
    </>
  );
}
export default SignUp;
