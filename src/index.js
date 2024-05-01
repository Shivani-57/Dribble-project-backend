
import connectDb from "./DB/connect.js";
import { app } from "./app.js";
import { PORT } from "./config.js";





connectDb()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.log("Database connection failed ", error);
  });

// Check if the script is running in a production environment

  app.listen(PORT || 5000, () => {
    console.log(`Updated Server is running on port: ${PORT}`);
  });


export default app;
