import dotenv from "dotenv";
import path from "path";

// Load the backend environment before importing the app, which constructs its
// OpenAI client. This works from both src/ during development and dist/ after
// compilation.
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = require("./app").default as typeof import("./app").default;

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`SecureCode AI backend running on port ${PORT}`);
});
