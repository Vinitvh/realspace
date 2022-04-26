import { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const onChange = (e) => {
    setEmail(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(email);
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Email sent successfully");
    } catch (error) {
      toast.error("Could not send reset email. Please try again");
    }
  };

  return (
    <section>
      <header>
        <p className="text-2xl font-bold text-center mt-4">Forgot Password</p>
      </header>
      <div className="w-80 mx-auto my-12 bg-secondary shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col">
        <form onSubmit={onSubmit}>
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
          <Link
            to="/sign-in"
            className="text-sm mt-4 text-primary hover:underline font-bold"
          >
            Sign In
          </Link>
          <div className="mt-4 text-center">
            <button type="submit" className="text-primary font-bold text-sm">
              Send Reset Link
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
export default ForgotPassword;
