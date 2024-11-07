import React from "react";
import { useSelector } from "react-redux";
import { userSelector } from "../redux/user/userSlice";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";


export default function PrivateRoute() {
  const { currentUser } = useSelector(userSelector);
  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}
