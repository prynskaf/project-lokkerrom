import express from "express";
import * as dotenv from "dotenv";
import router from "./router.mjs";
import morgan from "morgan";
import { protectY } from "./utils/auth.mjs";

dotenv.config();

const app = express();
const PORT = 3000;

const customLogger = () => (req, res, next) => {
	console.log("I'm a logging logger");
	next();
};
//

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//

app.use(customLogger());
app.use((req, res, next) => {
	req.sh_secret = "aaaa recipes";
	next();
});
app.get("/", (req, res) => {
	res.send("Welcome");
});

app.use("/api", router);

app.listen(PORT, console.log(`haaaaaa it started on http://localhost:${PORT}`));

export default app;
