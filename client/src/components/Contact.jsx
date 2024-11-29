import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  // console.log("contact page");
  // console.log(listing);

  const [landlord, setLandLord] = useState(null);
  const [message, setMessage] = useState(null);

  // console.log(landlord);

  const [getUserError, setGetUserError] = useState(null);

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/getUser/${listing.userRef}`);
        if (res.success === false) {
          return setGetUserError(res.message);
        }

        const data = await res.json();
        // console.log(data);

        setLandLord(data);
      } catch (error) {
        setGetUserError(error.message);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.userName}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>

          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={handleChange}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg"
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?subject= Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white p-3 text-center uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
