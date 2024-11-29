import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import { Toaster } from "react-hot-toast";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/updateListing";
import Listing from "./pages/Listing";
import Search from "./pages/Search";
import Plans from "./pages/Plans";
import Payment from "./pages/Payment";
import ShowListing from "./pages/ShowListing";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route path="/listing/:listingId" element={<Listing />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/payment/:amount" element={<Payment />} />
          <Route
            path="/update-listing/:listingId"
            element={<UpdateListing />}
          />
          <Route path="/showListing" element={<ShowListing />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
