import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPhotos } from "../features/photosSlice";
import { reset as userReset, addFavPhoto } from "../features/authSlice";
import Spinner from "../components/Spinner";
import Alert from "@mui/material/Alert";
import { useNavigate, NavLink } from "react-router-dom";
import PhotosMain from "../components/PhotosMain";

const Homepage = () => {
  const dispatch = useDispatch();

  const {
    photos,
    isLoading,
    isSuccess: photoSuccess,
  } = useSelector((state) => state.photos);
  const {
    message: userMessage,
    isSuccess: userSuccess,
    user,
  } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getPhotos());
    setTimeout(() => {
      dispatch(userReset());
    }, 6000);
  }, [navigate, user]);
  return (
    <div className="container homepage">
      {isLoading && <Spinner />}
      {userSuccess && userMessage.length > 0 && (
        <Alert className="alert-message" severity="success">
          {userMessage}
        </Alert>
      )}
      {photos && photos != null && <PhotosMain photos={photos} user={user} />}
    </div>
  );
};
export default Homepage;
