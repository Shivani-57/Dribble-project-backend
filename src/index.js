
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
if (process.env.NODE_ENV !== 'production') {
  // const PORT = PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Updated Server is running on port: ${PORT}`);
  });
}

export default app;
