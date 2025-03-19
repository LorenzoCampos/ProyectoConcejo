import Social from "../social/Social";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import ListOrderDay from "../adminPage/orderDay/ListOrderDay";

function OrdenesDelDia() {
  return (
    <>
      <Navbar />
      <ListOrderDay/>
      <Social />
      <Footer />
    </>
  );
}

export default OrdenesDelDia;