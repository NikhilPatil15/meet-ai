import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    /* Database connection */
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${process.env.DB_NAME}`
    );
    
    console.log(
      "Mongodb server connected: ",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.log("Error while connecting to the database: ", error);
  }
};
