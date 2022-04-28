import { Link } from "react-router-dom";
import { GiBathtub, GiPersonInBed } from "react-icons/gi";
import { FaTrashAlt } from "react-icons/fa";

function ListingsItem({ listing, id, onDelete }) {
  return (
    <li className="px-4">
      <div className="flex">
        <Link to={`/category/${listing.type}/${id}`}>
          <img
            src={listing.imageUrls[0]}
            alt={listing.name}
            className="w-auto h-4/5 md:h-3/5 object-cover rounded-3xl mx-auto"
          />
          <div className="w-auto h-full flex flex-col md:mt-20">
            <p className="py-1 text-sm text-gray font-bold">
              {listing.location}
            </p>
            <p className="text-2xl text-primary font-bold">{listing.name}</p>
            <div className="flex">
              <p className="text-base text-black font-bold">
                {listing.offer
                  ? `₹${listing.discountedPrice.toLocaleString("en-IN")}`
                  : `₹${listing.regularPrice.toLocaleString("en-IN")}`}
                {listing.type === "rent" ? " /month" : ""}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <GiPersonInBed className="text-2xl" />
              <p className="text-sm mt-2 text-primary font-bold">
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} bedrooms`
                  : "1 bedroom"}
              </p>
              <GiBathtub className="text-2xl" />
              <p className="text-sm mt-2 text-primary font-bold">
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} bathrooms`
                  : "1 bathroom"}
              </p>
            </div>
          </div>
        </Link>

        {onDelete && (
          <FaTrashAlt onClick={() => onDelete(listing.id, listing.name)} />
        )}
      </div>
    </li>
  );
}
export default ListingsItem;
