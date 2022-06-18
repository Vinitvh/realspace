import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

function CreateListing() {
  const [loading, setLoading] = useState(true);
  const [geoLocationEnabled, setGeoLocationEnalbled] = useState(false);
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

  const onSubmit = async (e) => {
    e.preventDefault();
    if (discountedPrice > regularPrice) {
      setLoading(false);
      toast.error("Discounted price should be lower than Regular price");
      return;
    }

    if (images.length > 6) {
      setLoading(false);
      toast.error("Max 6 images");
      return;
    }

    let geolocation = {};
    let location;

    if (geoLocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEO_API}`
      );

      const data = await response.json();

      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

      location =
        data.status === "ZERO_RESULTS"
          ? undefined
          : data.results[0]?.formatted_address;

      if (location === undefined || location.includes("undefined")) {
        setLoading(false);
        toast.error("Please enter a correct address");
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
      location = address;
    }

    //Store image in firebase
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

        const storageRef = ref(storage, "images/ " + fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imageUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });

    console.log(imageUrls);
    setLoading(false);
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
                  className="w-20 h-auto rounded text-center"
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
                  className="w-20 h-auto rounded text-center"
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
              className="w-90 h-auto rounded formInputFile"
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
