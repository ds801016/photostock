import React, { useState, useEffect } from "react";
import { AiOutlineArrowDown } from "react-icons/ai";
import arrayChunker from "array-chunker";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import { useDispatch } from "react-redux";
import { addFavPhoto } from "../features/authSlice";
import { NavLink } from "react-router-dom";

function PhotosMain({ photos, user }) {
  const [favId, setFavId] = useState([]);
  const dispatch = useDispatch();
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
    <div>
      {photos.length > 0 ? (
        <div className="photos">
          {["1", "1", "1"].map((e, i) => (
            <>
              <div className="photos-primary-div">
                {arrayChunker(photos, 3)[i] &&
                  arrayChunker(photos, 3)[i].map((photo) => (
                    <div key={photo._id} className="image-div">
                      {" "}
                      <img src={photo.fullUrl} alt="" />
                      <div className="text-div">
                        <div className="icons-div">
                          {/* fl_attachment */}
                          <a
                            href={photo.fullUrl.replace(
                              "upload/",
                              `upload/fl_attachment:${photo.originalName}/`
                            )}
                            download={photo.originalName}
                          >
                            <AiOutlineArrowDown className="photo-icon" />
                          </a>
                          {/* download link above */}
                          {user != null && (
                            <>
                              {favId.includes(photo._id) ? (
                                <MdFavorite
                                  onClick={() => handleFavDog(photo._id)}
                                  className={"photo-icon"}
                                />
                              ) : (
                                <MdFavoriteBorder
                                  onClick={() => handleFavDog(photo._id)}
                                  className="photo-icon"
                                  // id={photo._id}
                                />
                              )}
                            </>
                          )}
                        </div>
                        <NavLink to={`/profile/${photo.user._id}`}>
                          {photo.user.firstName}
                        </NavLink>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          ))}
        </div>
      ) : (
        <p className="page-heading">No Photos to show</p>
      )}
    </div>
  );
}

export default PhotosMain;
