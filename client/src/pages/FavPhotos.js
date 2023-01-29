import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { reset as userReset, addFavPhoto } from "../features/authSlice";
import { useNavigate, NavLink } from "react-router-dom";
import PhotosMain from "../components/PhotosMain";

export default function FavPhotos() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate;
  const { userProfileId } = useParams();
  const dispatch = useDispatch();
  const handleFavDog = (photoId) => {
    console.log("this is the phot id" + photoId);
    if (user != null) {
      console.log(user);
      dispatch(addFavPhoto({ userId: user.userId, photoId }));
    } else {
      console.log("no user");
    }
  };
  const allPhotos =
    user != null && user.favPhotos && user.favPhotos.length > 0 ? (
      <div className="photos"></div>
    ) : (
      <p className="page-heading">No Photos to show</p>
    );
  useEffect(() => {
    if (user != null) {
      //   dispatch(getPhotos(store.getState().auth.user.userId));
    } else if (user == null && !userProfileId) {
      // console.log("no user found");
      navigate("/login");
    }
  }, []);
  return (
    <div className="container liked-photos">
      <p className="page-heading">Liked Photos</p>
      <PhotosMain photos={user.favPhotos} user={user} />
    </div>
  );
}
