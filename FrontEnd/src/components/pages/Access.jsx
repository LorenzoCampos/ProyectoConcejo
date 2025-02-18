
import Login from "../login/Login";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";

function Access() {
  const accessStyle = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh"
  };

  const mainAccessStyle = {
    flex: 1
  };

  return (
    <div style={accessStyle}>
      <Navbar />
      <main style={mainAccessStyle}>
        <Login />
      </main>
      <Footer />
    </div>
  );
}

export default Access;

  