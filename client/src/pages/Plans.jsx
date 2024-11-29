import React from "react";
import { FaAddressBook } from "react-icons/fa6";
import { IoMdCall } from "react-icons/io";
import { FaHeadphonesAlt } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";
import { Link } from "react-router-dom";
function Plans() {
  return (
    <main className="px-4">
      <div className="w-full divide-y divide-slate-200 flex flex-col bg-gradient-to-r from-slate-800 to-slate-600 rounded-lg  h-96 mt-10 mx-auto sm:w-11/12 lg:w-9/12 min-w-[850px] border border-slate-300 p-4">
        <div className=" flex flex-col  ">
          <p className="font-semibold text-white">Hey there,</p>
          <p className="text-white">
            Subscribe to Premium today to save 50,000 on brokerage, along with
            other benefits.
          </p>
        </div>
        <div className=" flex flex-row gap-2 justify-start">
          <div className="mt-9 text-white items-center  min-w-[300px]">
            <ul className="space-y-4 ">
              <li className="flex gap-4  w-screen">
                <FaAddressBook />
                <p>Available contact owner</p>
              </li>
              <li className="flex gap-4">
                <FaHeadphonesAlt />
                <p>Field Visit Assistance</p>
              </li>
              <li className="flex gap-4">
                <FaWhatsapp />
                <p>Relationship Manager Assistance</p>
              </li>
              <li className="flex gap-4">
                <MdSupportAgent />
                <p>Professional Photoshoot of Property</p>
              </li>
            </ul>
          </div>
          <div className="flex gap-6 mt-2 justify-around w-full ">
            <div className="bg-red-400 w-36 items-center flex flex-col rounded-lg gap-3">
              <h1 className="font-bold">Basic</h1>
              <p>10 </p>
              <p>Medium slot</p>
              <p>No</p>
              <p>No</p>
              <p>Rs.499</p>
              <Link to={`/payment/499`}>
                <div className="border-l mb-3 border-red-600 hover:bg-red-100 hover:scale-105 transition duration-200 border p-2 rounded-md bg-amber-50">
                  Upgrade
                </div>
              </Link>
            </div>
            <div className="bg-blue-400 w-36 items-center flex flex-col rounded-lg gap-3">
              <h1 className="font-bold">Professional</h1>
              <p>20 </p>
              <p>Medium slot</p>
              <p>Yes</p>
              <p>No</p>
              <p>Rs.799</p>
              <Link to={`/payment/799`}>
                <div className="border-l mb-3 border-blue-600 hover:bg-blue-100 hover:scale-105 transition duration-200 border p-2 rounded-md bg-amber-50">
                  Upgrade
                </div>
              </Link>
            </div>
            <div className="bg-yellow-400  w-36 items-center flex flex-col rounded-lg gap-3">
              <h1 className="font-bold">Premium</h1>
              <p>30 </p>
              <p>Medium slot</p>
              <p>Yes</p>
              <p>Yes</p>
              <p>Rs.1199</p>
              <Link to={`/payment/1199`}>
                <div className="border-l mb-3 border-yellow-600 hover:bg-yellow-100 hover:scale-105 transition duration-200 border p-2 rounded-md bg-amber-50">
                  Upgrade
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Plans;
