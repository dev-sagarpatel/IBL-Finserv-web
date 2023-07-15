const Razorpay = require("razorpay");
const crypto = require("crypto");

let KEY_ID = "rzp_test_XG42OuDifdAdMn";
let KEY_SECRET = "cektPl5fiowZ3net5FbwkyIB";
const instance = new Razorpay({
  key_id: KEY_ID,
  key_secret: KEY_SECRET,
});

module.exports = {
  createOrder: async (req, res) => {
    try {
      let options = {
        amount: req.body.amount * 100,
        currency: "INR",
      };
      instance.orders.create(options, function (err, order) {
        if (err) {
          return res.status(500).json({
            message: "somthing want wrong, try again...!",
            error: true,
            data: err,
          });
        }
        return res.status(200).json({
          message: "Order Created...",
          error: false,
          data: {
            order,
            key_id: KEY_ID,
          },
        });
      });
    } catch (error) {
      return res.status(500).json({
        message: "server error...",
        error: true,
        data: error,
      });
    }
  },
  paymentConfirm: async (req, res) => {
    console.log(req.body);
    try {
      let body =
        req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;

      let expectedSignature = crypto
        .createHmac("sha256", KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      let response = { signatureIsValid: "false" };

      if (expectedSignature === req.body.razorpay_signature) {
        response = { signatureIsValid: "true" };

        return res.redirect(
          `${process.env.PAYMENT_DONE_URL}?orderId=${"hdjwhy8ekwneeke"}`
        );
      }
      return res.status(400).json({
        message: "payment not conformed..!",
        error: true,
        data: response,
      });
    } catch (error) {
      console.log("Error is => ", error);
      res.status(500).json({
        message: error?.message || error,
        error: true,
        data: {},
      });
    }
  },
};
