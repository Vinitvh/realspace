import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function CreateListing() {
  const [loading, setLoading] = useState(true);
  const [geoLocationEnabled, setGeoLocationEnalbled] = useState(true);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  });

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
          setLoading(false);
        } else {
          navigate("/sign-in");
        }
      });
    }

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  if (loading) {
    return <h3>Loading...</h3>;
  }

  const onMutate = (e) => {
    let boolean = null;

    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }

    // files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    //text/boolean/numbers
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <section className="my-4 flex flex-col items-center justify-center">
      <header>
        <p className="text-center font-bold">Create a Listing</p>
      </header>

      <main className="mt-10">
        <form
          onSubmit={onSubmit}
          className="mx-12 bg-white px-20 py-4 rounded-lg"
        >
          <label className="text-sm font-bold">Sell / Rent</label>
          <div className="flex my-4">
            <button
              type="button"
              className={
                type === "sale"
                  ? "px-2 py-1 bg-primary"
                  : "px-5 py-1 bg-secondary rounded-lg mr-2"
              }
              id="type"
              value="sale"
              onClick={onMutate}
            >
              Sell
            </button>
            <button
              type="button"
              className={
                type === "rent" ? "px-5 py-1 bg-primary rounded-lg" : "bg-gray"
              }
              id="type"
              value="rent"
              onClick={onMutate}
            >
              Rent
            </button>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-bold mb-2">Name</label>
            <input
              type="text"
              className="rounded"
              id="name"
              value={name}
              onChange={onMutate}
              maxLength="32"
              minLength="10"
              required
            />
          </div>
          <div className="flex my-4">
            <div className="flex flex-col mr-4">
              <label className="text-sm font-bold mb-2">Bedrooms</label>
              <input
                type="number"
                className="w-10 h-auto rounded text-center"
                id="bedrooms"
                value={bedrooms}
                onChange={onMutate}
                min="1"
                max="50"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-bold mb-2">Bathrooms</label>
              <input
                type="number"
                className="w-10 h-auto rounded text-center"
                id="bathrooms"
                value={bathrooms}
                onChange={onMutate}
                min="1"
                max="50"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-bold">Parking</label>
            <div className="flex my-4">
              <button
                type="button"
                className={
                  parking
                    ? "px-2 py-1 bg-primary"
                    : "px-5 py-1 bg-secondary rounded-lg mr-2"
                }
                id="parking"
                value={true}
                onClick={onMutate}
              >
                Yes
              </button>
              <button
                type="button"
                className={
                  !parking && parking !== null
                    ? "px-5 py-1 bg-primary rounded-lg"
                    : "bg-gray"
                }
                id="parking"
                value={false}
                onClick={onMutate}
              >
                No
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-bold">Furnished</label>
            <div className="flex my-4">
              <button
                type="button"
                className={
                  furnished
                    ? "px-2 py-1 bg-primary"
                    : "px-5 py-1 bg-secondary rounded-lg mr-2"
                }
                id="furnished"
                value={true}
                onClick={onMutate}
              >
                Yes
              </button>
              <button
                type="button"
                className={
                  !furnished && furnished !== null
                    ? "px-5 py-1 bg-primary rounded-lg"
                    : "bg-gray"
                }
                id="furnished"
                value={false}
                onClick={onMutate}
              >
                No
              </button>
            </div>
          </div>
          <div className="flex flex-col my-4">
            <label className="text-sm font-bold mb-2">Address</label>
            <textarea
              type="text"
              className="w-56 h-20"
              id="address"
              value={address}
              onChange={onMutate}
              required
            ></textarea>
          </div>

          {!geoLocationEnabled && (
            <div className="flex my-4">
              <div className="flex flex-col mr-4">
                <label className="text-sm font-bold mb-2">Latitude</label>
                <input
                  type="number"
                  className="w-20 h-auto rounded bg-secondary text-center"
                  id="latitude"
                  value={latitude}
                  onChange={onMutate}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold mb-2">Longitude</label>
                <input
                  type="number"
                  className="w-20 h-auto rounded bg-secondary text-center"
                  id="longitude"
                  value={longitude}
                  onChange={onMutate}
                  required
                />
              </div>
            </div>
          )}
          <div>
            <label className="text-sm font-bold">Offer</label>
            <div className="flex my-4">
              <button
                type="button"
                className={
                  offer
                    ? "px-2 py-1 bg-primary"
                    : "px-5 py-1 bg-secondary rounded-lg mr-2"
                }
                id="offer"
                value={true}
                onClick={onMutate}
              >
                Yes
              </button>
              <button
                type="button"
                className={
                  !offer && offer !== null
                    ? "px-5 py-1 bg-primary rounded-lg"
                    : "bg-gray"
                }
                id="offer"
                value={false}
                onClick={onMutate}
              >
                No
              </button>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-bold my-4">Regular Price</label>
            <div className="flex">
              <input
                type="number"
                className="w-40 h-auto text-center rounded mr-2"
                id="regularPrice"
                value={regularPrice}
                onChange={onMutate}
                min="50"
                max="5000000000"
                required
              />
              {formData.type === "rent" && (
                <p className="text-sm font-bold">₹ / month</p>
              )}
            </div>
          </div>
          {offer && (
            <div className="flex flex-col">
              <label className="text-sm font-bold my-4">Discounted Price</label>
              <div className="flex">
                <input
                  type="number"
                  className="w-40 h-auto text-center rounded mr-2"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={onMutate}
                  min="50"
                  max="5000000000"
                  required={offer}
                />
                {formData.type === "rent" && (
                  <p className="text-sm font-bold">₹ / month</p>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col">
            <label className="text-sm font-bold mt-4">Images</label>
            <p className="text-sm text-gray">
              The first image will be cover (max 6).
            </p>
            <input
              type="file"
              className="w-90 h-auto rounded"
              id="images"
              onChange={onMutate}
              max="6"
              accept=".jpg,.png,.jpeg"
              multiple
              required
            />
          </div>
          <button
            type="submit"
            className="w-96 my-6 px-4 py-1 bg-primary mx-auto rounded-lg text-white font-bold"
          >
            Create Listing
          </button>
        </form>
      </main>
    </section>
  );
}
export default CreateListing;
