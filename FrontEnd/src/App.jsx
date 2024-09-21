import { NavBar, Footer } from "./components";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import Normativas from "./components/pages/Normativas";

function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Normativas" element={<Normativas />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
