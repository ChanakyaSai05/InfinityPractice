require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const userRoute = require("./routes/users");
const ordersRoute = require("./routes/orders");
const port = process.env.PORT || 5000;
const { User1 } = require("./models/User1");
// Allowing cross origin access
app.use(cors());
// Connecting mongo db
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connection Successful!"))
  .catch((err) => console.log(err));

app.use(express.json());

async function userdetails() {
  let user1 = await User1.find();
  // console.log(user1);
  for (let i = 0; i < 5; i++) {
    await User1.create({
      First_name: `F${i + 1}`,
      Last_name: `L${i + 1}`,
      email: `newemail${i + 1}@gmail.com`,
    });
  }
  console.log(user1);
}
userdetails();

app.use("/api/auth", userRoute);
// app.use("/api/user1", user);
app.use("/api/orders", ordersRoute);
app.listen(port, () => {
  console.log(`Backend server is running! on port ${port}`);
});
