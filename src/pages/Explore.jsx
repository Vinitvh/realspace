import { Link } from "react-router-dom";
import rentCategoryImg from "../assets/rentCategory.jpg";
import saleCategoryImg from "../assets/saleCategory.jpg";

function Explore() {
  return (
    <section>
      <header className="my-2 mx-12">
        <h1 className="text-3xl font-bold text-center">Explore</h1>
      </header>

      <main className="my-8">
        {/* Slider */}
        <p className="mx-12 my-2 text-xl font-bold">Categories</p>
        <div className="container mx-auto w-full grid grid-cols-2">
          <div>
            <Link to="/category/rent">
              <img
                src={rentCategoryImg}
                alt="Rent Category"
                className="w-auto h-4/5 object-cover rounded-3xl mx-auto"
              />
            </Link>
            <p>Places for Rent</p>
          </div>
          <div>
            <Link to="/category/sale">
              <img
                src={saleCategoryImg}
                alt="Sale Category"
                className="w-auto h-4/5 object-cover rounded-3xl mx-auto"
              />
            </Link>
            <p>Places for Sale</p>
          </div>
        </div>
      </main>
    </section>
  );
}
export default Explore;
