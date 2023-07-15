import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Navbar from "./components/layout/Navbar";
import PaymentSuccess from "./pages/PaymentSuccess";

const App = () => {
  return (
    <main>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="payment-success" element={<PaymentSuccess />} />
      </Routes>
    </main>
  );
};

export default App;
