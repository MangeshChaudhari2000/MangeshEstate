import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import { MdEdit } from "react-icons/md";

const ShowListing = () => {
  const [userListing, setUserListing] = useState([]);
  const [showListingError, setShowListingsError] = useState("");
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const handleShowListing = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        return setShowListingsError(data.message);
      }

      setUserListing(data);
    } catch (error) {
      setShowListingsError(error.message);
    }
  };

  useEffect(() => {
    handleShowListing();
  }, []);

  const handleListDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success === false) {
        return setShowListingsError(data.message);
      }

      setUserListing((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      return setShowListingsError(error.message);
    }
  };
  return (
    <>
     {error && <p className="text-red-700 text-lg">{error}</p>}
     {loading && <p className="text-slate-700 text-lg">{loading}</p>}
      {userListing && userListing.length > 0 ? (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {userListing.map((listing) => (
            <div
              className="flex  w-full md:w-9/12 lg:w-9/12 mx-auto shadow-md hover:shadow-lg hover:scale-105 transition duration-150"
              key={listing._id}
            >
              <Link
                className="border p-4 w-full rounded-lg  flex justify-between items-center gap-4"
                key={listing._id}
                to={`/listing/${listing._id}`}
              >
                <img
                  className="h-40 w-40 object-cover hover:scale-105 transition duration-150"
                  src={listing.imageUrls[0]}
                  alt="listingCover"
                />
                <div className="flex flex-col w-6/12">
                  <p className="text-slate-700 mb-2 font-semibold hover:underline truncate overflow-hidden">
                    {listing.name}
                  </p>
                  <p className="text-slate-700 font-semibold hover:underline truncate overflow-hidden max-w-9/12">
                    {listing.address}
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => handleListDelete(listing._id)}
                    className="text-red-700 flex gap-1 items-center space-x-2 hover:border-red-500 hover:scale-105 hover:shadow-lg hover:border rounded-lg p-1 transition duration-150"
                  >
                    Delete
                    <MdDeleteOutline className=" text-lg" />
                  </button>

                  <Link to={`/update-listing/${listing._id}`}>
                    <button className="text-green-800 gap-1 flex items-center space-x-2 hover:border-green-800 hover:scale-105 hover:shadow-lg hover:border rounded-lg p-1 transition duration-150">
                      Edit <MdEdit />
                    </button>
                  </Link>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <h1>No listing found</h1>
      )}
      {showListingError && (
        <p className="text-red-700 text-lg">{showListingError}</p>
      )}
     
    </>
  );
};

export default ShowListing;
