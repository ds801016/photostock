import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AddPhoto from "../components/AddPhoto";
import PhotosThumbNail from "../components/PhotosThumbNail";
import { getPhotos, reset as photoReset } from "../features/photosSlice";
import Spinner from "../components/Spinner";
import { store } from "../app/store";
import Alert from "@mui/material/Alert";
import axios from "axios";

const Profile = () => {
  const dispatch = useDispatch();
  const [yourPhotos, setYourPhotos] = useState([]);
  const [profileUser, setProfileUser] = useState({});
  const navigate = useNavigate();
  const { userProfileId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { photos, isLoading, isSuccess, message, isError } = useSelector(
    (state) => state.photos
  );

  const getUserProfile = async () => {
    const { data } = await axios.get(`/user/${userProfileId}`);
    setProfileUser(data);
  };
  useEffect(() => {
    if (store.getState().auth.user != null) {
      dispatch(getPhotos(store.getState().auth.user.userId));
    } else if (user == null && !userProfileId) {
      // console.log("no user found");
      // navigate("/login");
    }
    if (userProfileId) {
      // console.log(userProfileId);
      dispatch(getPhotos(userProfileId));
      getUserProfile();
    }
  }, []);
  useEffect(() => {
    if (!isError) {
      setYourPhotos(photos);
    }
  }, [photos]);
  return (
    <div className="container profile">
      {isLoading && <Spinner />}
      {user != null && user.email && (
        <>
          {message && message.length > 0 && !isError ? (
            <Alert className="alert-message" severity="success">
              {message}
            </Alert>
          ) : (
            message &&
            message.length && (
              <Alert className="alert-message" severity="error">
                {message}
              </Alert>
            )
          )}
          {userProfileId == user.userId && <AddPhoto userId={user.userId} />}

          {/* your photos */}
          <p className="page-heading">
            {yourPhotos[0] &&
            yourPhotos.length != 0 &&
            user &&
            userProfileId == user.userId
              ? "Your"
              : profileUser.firstName}{" "}
            Photos
          </p>

          <div className="your-photos">
            <PhotosThumbNail
              yourPhotos={yourPhotos}
              userProfileId={userProfileId}
              user={user}
            />
          </div>
        </>
      )}
      {user == null && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <NavLink className="link-btn" to="/login">
            Please login to see other users Photos
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default Profile;
