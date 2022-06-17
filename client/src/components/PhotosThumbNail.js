import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deletePhoto } from "../features/photosSlice";
import { AiOutlineArrowDown } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import { addFavPhoto } from "../features/authSlice";

export default function PhotosThumbNail({ yourPhotos, userProfileId, user }) {
  const [favId, setFavId] = useState([]);
  const dispatch = useDispatch();
  const handleDeletePhoto = async (photoId) => {
    dispatch(deletePhoto(photoId));
  };
  const handleFavDog = (photoId) => {
    // console.log("this is the phot id" + photoId);
    if (user != null) {
      console.log(user);
      dispatch(addFavPhoto({ userId: user.userId, photoId }));
    } else {
      console.log("no user");
    }
  };
  useEffect(() => {
    if (user != null) {
      let arr = [];
      user.favPhotos.map((p) => arr.push(p._id));
      setFavId(arr);
    }
  }, [user]);
  return (
    <div className="photos">
      {yourPhotos && yourPhotos.length > 0 ? (
        yourPhotos.map(
          (p) =>
            p.user._id == userProfileId && (
              <>
                <div key={p._id} className="image-div">
                  <img src={p.fullUrl && p.fullUrl} alt="" />
                  <div className="text-div">
                    {/* <div className="icons-div"> */}
                    {p.user._id == user.userId && (
                      <button onClick={() => handleDeletePhoto(p.cloudinaryId)}>
                        <FaTrashAlt
                          style={{ fontSize: "1.5rem" }}
                          className="photo-icon"
                        />
                      </button>
                    )}
                    {favId.includes(p._id) ? (
                      <MdFavorite
                        onClick={() => handleFavDog(p._id)}
                        className={"photo-icon"}
                      />
                    ) : (
                      <MdFavoriteBorder
                        onClick={() => handleFavDog(p._id)}
                        className="photo-icon"
                        // id={photo._id}
                      />
                    )}
                    {/* </div> */}
                    {/* <div className="icons-div"> */}
                    <a
                      href={p.fullUrl.replace(
                        "upload/",
                        `upload/fl_attachment:${p.originalName}/`
                      )}
                      download={p.originalName}
                    >
                      <AiOutlineArrowDown className="photo-icon" />
                    </a>

                    <p>{p.user.firstName}</p>
                    {/* </div> */}
                  </div>
                </div>
              </>
            )
        )
      ) : (
        <p className="page-heading">No photos found</p>
      )}
    </div>
  );
}
