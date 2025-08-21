require("dotenv").config();
const app = require("./src/app");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");

dotenv.config();
const PORT = process.env.PORT || 5000;

//Connection of mongodb
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
