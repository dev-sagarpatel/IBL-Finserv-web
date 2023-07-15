import styles from "./home.module.scss";
// import { useMutation } from "react-query";
import { postData } from "../../api/api";

const Home = () => {
  const handlePayment = async () => {
    const data = await postData({
      endpoints: "/dashboard/order",
      userData: { amount: 500 },
    });

    const options = {
      key: import.meta.env.VITE_KEY_ID,
      amount: data.data.order.amount,
      currency: "INR",
      name: "Nike",
      description: "Transaction for shopping with Nike.",
      image: "",
      order_id: data.data.order.id,
      callback_url: `${import.meta.env.VITE_BACKEND_URL}/dashboard/payment`,
      prefill: {
        name: "Test Boy",
        email: "test12@gmail.com",
      },
      theme: {
        color: "black",
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  };

  return (
    <main className={styles.paymentSuccess}>
      <div>
        <button onClick={handlePayment}>Payment</button>
      </div>
    </main>
  );
};

export default Home;
