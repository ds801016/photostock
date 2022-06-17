import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import Profile from "./pages/Profile";
import FavPhotos from "./pages/FavPhotos";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "./components/Footer";
function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const photoState = useSelector((state) => state.photo);
  const navigate = useNavigate();
  useState(() => {}, [navigate, dispatch, user]);
  return (
    <div className="App">
      <Header />
      {/* <Spinner /> */}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:userProfileId" element={<Profile />} />
        <Route
          path="/profile/:userProfileId/favPhotos"
          element={<FavPhotos />}
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
