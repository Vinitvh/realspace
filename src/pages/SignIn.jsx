import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye } from "react-icons/fi";

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  // const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <>
      <header>
        <p className="text-2xl font-bold text-center mt-4">Welcome Back!</p>
      </header>
      <div className="w-80 mx-auto my-12 bg-secondary shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col">
        <form>
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
              Sign In
            </button>
            <Link
              to="/forgot-password"
              className="text-sm text-rose font-semibold"
            >
              Forgot Password?
            </Link>
          </div>
        </form>
        <Link
          to="/sign-up"
          className="text-center mt-4 text-primary hover:underline font-bold"
        >
          Sign Up Instead
        </Link>
      </div>
    </>
  );
}
export default SignIn;
