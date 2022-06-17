import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPhoto } from "../features/photosSlice";
import Button from "@mui/material/Button";
import categories from "../categories";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";

export default function AddPhoto({ userId }) {
  const [image, setImage] = useState({ image: null, category: "" });
  const dispatch = useDispatch();

  const handleImage = (e) => {
    setImage({ ...image, image: e.target.files[0] });
  };

  const handleAddPhoto = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("newPhoto", image.image);
    formData.append("image", JSON.stringify({ ...image, userId }));
    // formData.append()
    dispatch(addPhoto(formData));
    setImage(image.image);
  };
  const handleChange = (e) => {
    setImage({ ...image, [e.target.name]: e.target.value });
  };
  return (
    <form className="add-photo-form" onSubmit={handleAddPhoto}>
      <p className="page-heading">Add Photo</p>
      <FormControl className="category-select">
        <InputLabel id="demo-simple-select-label">Category</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="category"
          value={image.category}
          name="category"
          label="Category"
          onChange={handleChange}
        >
          {categories.map((category) => (
            <MenuItem value={category}>{category}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        className={image.image != null ? "secondary add-button" : "add-button"}
        component="label"
      >
        Select Photo
        <input id="newPhoto" hidden onChange={handleImage} type="file" />
      </Button>
      {image.image != null && (
        <>
          <button className="add-button">Add Selected Photo</button>
          <img
            className="preview-image"
            src={
              image.image != null ? URL.createObjectURL(image.image) : undefined
            }
          />
        </>
      )}
    </form>
  );
}
