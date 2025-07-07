import dotenv from "dotenv";
import app from "./app";
import { connectToDatabase } from "./task/infrastructure/database/mongo/mongoConnection";

dotenv.config({ path: `.env.${process.env.NODE_ENV || "local"}` });

async function bootstrap() {
  try {
    await connectToDatabase();
    app.listen(process.env.PORT, () => {
      console.log(`Image processing API is running on port ${process.env.PORT}`);
    });
  } catch (error: unknown) {
    const baseErrorMessage = "Failed to start the server:";
    if (error instanceof Error) {
      console.error(baseErrorMessage, error.message);
    } else {
      console.error(baseErrorMessage, "Unknown error.");
    }
    process.exit(1);
  }
}

bootstrap();
