import express from "express";
import client from "../db.mjs";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

const router = express.Router();
const app = express();
const ACCESS = process.env.access;
const REFRESH = process.env.refresh;
app.use(express.json());
dotenv.config();

const genAccToken = (user) => {
	return jwt.sign(user, ACCESS, { expiresIn: "20s" });
};

const authi = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const TOKEN = authHeader && authHeader.split(" ")[1];
	if (TOKEN == null) return res.sendStatus(401);

	jwt.verify(TOKEN, ACCESS, (err, user) => {
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	});
};

router.get("/", authi, (req, res) => {
	res.json("aaa");
});

router.post("/", (req, res) => {
	const username = req.body.username;
	const user = { name: username };
	const accessToken = genAccToken(user);
	const refreshToken = jwt.sign(user, REFRESH);
	res.json({ accessToken: accessToken, refreshToken: refreshToken });
});
export default router;
