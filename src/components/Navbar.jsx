import { useNavigate, useLocation } from "react-router-dom";
import { RiCompass3Line } from "react-icons/ri";
import { BsTag } from "react-icons/bs";
import { FiUser } from "react-icons/fi";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const pathMatchRoute = (route) => {
    if (route === location.pathname) {
      return true;
    }
  };

  return (
    <nav className="h-14 bg-primary">
      <div className="h-full flex items-center justify-between">
        <h1 className="text-2xl font-bold ml-16 text-secondary">RealSpace</h1>
        <ul className="flex items-center text-2xl mr-16 ">
          <li
            className="flex flex-col items-center mr-14 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <RiCompass3Line
              className={pathMatchRoute("/") ? "text-white" : "text-secondary"}
            />
            <span
              className={
                pathMatchRoute("/")
                  ? "text-white text-sm font-bold"
                  : "text-secondary text-sm font-bold"
              }
            >
              Explore
            </span>
          </li>
          <li
            className="flex flex-col items-center mr-14 cursor-pointer"
            onClick={() => navigate("/offers")}
          >
            <BsTag
              className={
                pathMatchRoute("/offers") ? "text-white" : "text-secondary"
              }
            />
            <span
              className={
                pathMatchRoute("/offers")
                  ? "text-white text-sm font-bold"
                  : "text-secondary text-sm font-bold"
              }
            >
              Offers
            </span>
          </li>
          <li
            className="flex flex-col items-center cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <FiUser
              className={
                pathMatchRoute("/profile") ? "text-white" : "text-secondary"
              }
            />
            <span
              className={
                pathMatchRoute("/profile")
                  ? "text-white text-sm font-bold"
                  : "text-secondary text-sm font-bold"
              }
            >
              Profile
            </span>
          </li>
        </ul>
      </div>
    </nav>
  );
}
export default Navbar;
