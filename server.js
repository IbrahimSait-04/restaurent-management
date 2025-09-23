import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectdb from "./src/config/db.js";

import adminRouter from "./src/router/adminRouter.js";
import staffRouter from "./src/router/staffRouter.js";
import customerRouter from "./src/router/customerRouter.js";
import menuRouter from "./src/router/menuRouter.js";
import orderRouter from "./src/router/orderRouter.js";
import paymentRouter from "./src/router/paymentRouter.js";
import reservationRouter from "./src/router/reservationRouter.js";

dotenv.config();
connectdb();

const app = express();
app.use(express.json());
app.use(cors());


app.use("/api/admin", adminRouter);
app.use("/api/staff", staffRouter);
app.use("/api/customer", customerRouter);
app.use("/api/menu", menuRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/reserv", reservationRouter);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port 5000");
});


export default app;
