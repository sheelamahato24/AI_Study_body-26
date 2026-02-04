import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import Summary from "./Summary";
import Quize from "./Quize";
import FlashCard from "./Flashcard";   // ✅ correct import
import "./App.css";

function App() {
  const location = useLocation();

  const isOverlay =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  const isHomePage = location.pathname === "/";

  return (
    <>
      <Navbar />

      {(isHomePage || isOverlay) && (
        <div className={isOverlay ? "blur" : ""}>
          <Home />
        </div>
      )}

      {isOverlay && (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      )}

      <Routes>
        <Route path="/summary" element={<Summary />} />
        <Route path="/quize" element={<Quize />} />
        <Route path="/flashcard" element={<FlashCard />} /> {/* ✅ fixed */}
      </Routes>
    </>
  );
}

export default App;
