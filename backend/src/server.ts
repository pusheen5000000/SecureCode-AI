import dotenv from "dotenv";
import path from "path";

// Workspace scripts run with backend/ as the current directory. Resolve the
// shared repository environment file explicitly before loading the app and
// constructing its OpenAI client.
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const app = require("./app").default as typeof import("./app").default;

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`SecureCode AI backend running on port ${PORT}`);
});
