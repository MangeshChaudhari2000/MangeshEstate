import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { userAction } from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [showListingsError, setShowListingsError] = useState(false);
  const [UserListing, setUserListing] = useState([]);
  const {
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOutStart,
    signOutSuccess,
    signOutFailure,
  } = userAction;
  const dispatch = useDispatch();

  // firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 &&
  // request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        console.log(error);
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log(downloadURL);
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // console.log(formData);
  const handleSubmit = async (e) => {
    console.log("HandleSubmi click");

    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return dispatch(updateUserFailure(data.message));
      } else {
        setUpdateSuccess(true);
        return dispatch(updateUserSuccess(data));
      }
    } catch (error) {
      console.log(error);

      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      console.log("handleDeleteUser called");

      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log(data);

      if (data.success === false) {
        return dispatch(deleteUserFailure(data.message));
      } else {
        return dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      return dispatch(deleteUserFailure(data.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch(`/api/auth/signOut`);
      const data = await res.json();
      if (data.success === false) {
        return dispatch(signOutFailure(data.message));
      } else {
        return dispatch(signOutSuccess());
      }
    } catch (error) {
      return dispatch(signOutFailure(data.message));
    }
  };

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
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          src={formData.avatar ? formData.avatar : currentUser.avatar}
          alt="profilePhoto"
          onClick={() => fileRef.current.click()}
        />
        {fileUploadError ? (
          <>
            <span className="text-red-700 text-center">
              Error Image Upload: {error}
              [note: Image must be less than 2MB]
            </span>
          </>
        ) : filePerc > 0 && filePerc < 100 ? (
          <span className="text-slate-700 text-center">{`Uploading percentage ${filePerc}`}</span>
        ) : filePerc === 100 && !fileUploadError ? (
          <span className="text-green-700 text-center">
            Image Successfully Uploaded
          </span>
        ) : (
          ""
        )}

        <input
          type="text"
          placeholder="userName"
          id="userName"
          className=" border p-3 rounded-lg"
          defaultValue={currentUser.userName}
          onChange={handleChange}
        />

        <input
          type="text"
          placeholder="email"
          id="email"
          className=" border p-3 rounded-lg"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="*********"
          id="password"
          className=" border p-3 rounded-lg"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          type="submit"
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-85 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700">
        {" "}
        {updateSuccess ? "Profile Updated Successfully" : ""}
      </p>
      <button onClick={handleShowListing} className="text-green-700 w-full ">
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? showListingsError : ""}
      </p>
      {UserListing && UserListing.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listings
          </h1>
          {UserListing.map((listing) => (
            <div
            className="flex justify-between"
              key={listing._id}
            >
              <Link
                className="border rounded-lg p-3 flex justify-between items-center gap-4"
                key={listing._id}
                to={`/listing/${listing._id}`}
              >
                <img
                  className="h-16 w-16 object-contain"
                  src={listing.imageUrls[0]}
                  alt="listingCover"
                />
                <p className="text-slate-700 font-semibold flex-1 hover:underline truncate">
                  {listing.name}
                </p>
              </Link>
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => handleListDelete(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                <button className="text-greem-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
