import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import ListingsItem from "../components/ListingsItem";

function Category() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Get listings
        const listingsRef = collection(db, "listings");

        // Query
        const q = query(
          listingsRef,
          where("type", "==", params.categoryName),
          orderBy("timestamp", "desc"),
          limit(10)
        );

        const listings = [];

        const querySnap = await getDocs(q);

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error("Could not get listings");
      }
    };

    fetchListings();
  }, [params]);

  return (
    <section>
      <header className="ml-12 mt-4">
        <p className="text-2xl font-bold">
          {params.categoryName === "sale"
            ? "Places for Sale"
            : "Places for Rent"}
        </p>
      </header>

      {loading ? (
        <h3>Loading...</h3>
      ) : listings && listings.length > 0 ? (
        <>
          <main className="mt-4">
            <ul className="w-auto h-64 flex flex-col md:flex-row">
              {listings.map((listing) => (
                <ListingsItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
          </main>
        </>
      ) : (
        <p>No listings for {params.categoryName}</p>
      )}
    </section>
  );
}
export default Category;
