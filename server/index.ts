import * as express from "express";
import * as path from "path";
import usersRoutes from "./routes/users.routes";
import petsRoutes from "./routes/pets.routes";
import mailsRoutes from "./routes/mails.routes";
import { sequelize } from "./db";
const app = express();
const PORT = process.env.PORT || 3000;

// Alter tables
// sequelize.sync({ alter: true });

// Middlewares
app.use(express.json());
app.use(express.static("dist"));

// Routes
app.use("/api/users", usersRoutes);
app.use("/api/pets", petsRoutes);
app.use("/api/sendmail", mailsRoutes);

app.get("*", (req, res) => {
  // Development
  // const pathJoined = path.resolve(__dirname, "../dist/index.html");

  // Production
  const pathJoined = path.resolve(__dirname, "../dist/index.html");
  console.log(pathJoined);
  res.sendFile(pathJoined);
});

// Server
app.listen(PORT, () => console.log("server on port", PORT));
