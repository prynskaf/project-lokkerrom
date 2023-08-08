import express from "express";
import client from "../db.mjs";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { hashPass, comparePass } from "../utils/auth.mjs";
import bcrypt, { compare } from "bcrypt";

const router = express.Router();
const app = express();
const ACCESS = process.env.access;

app.use(express.json());
dotenv.config();

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

router.get("/", async (req, reso) => {
	const username = await req.body.user;
	const password = await req.body.password;
	// console.log(username);
	console.log(password);

	try {
		const checkUsername = await client.query(
			`SELECT * from users where username = '${username}' ;`,
			async (err, r, req, next) => {
				if (await err) {
					res.status(401).send("no one found with this name");
				}
				if ((await r.rows[0]) === undefined) {
					res.status(401).send("no one found with this name");
				} else {
					client.query(`SELECT password from users where username = '${username}';`, async (err, res) => {
						if (await err) {
							res.status(401).send("Wrong password");
						}
						if ((await res.rows[0]) === undefined) {
							res.status(401).send("Wrong password");
						}
						if (res.rows[0].password.length > 0 && (await comparePass(password, res.rows[0].password))) {
							//Here i am comparing
							console.log("valid");
							reso.status(200).send(`Hello welcome back ${username}`);
						} else {
							reso.status(401).send(`Invalid password for ${username}`);
						}
					});
				}
			},
		);
	} catch (e) {
		res.send(e);
	}
});

// router.post("/", (req, res) => {
// 	const { user, password } = req.body;

// 	client.query(`SELECT * from users where username = '${user}' AND password = '${password}'`, (err, r) => {
// 		if (err) {
// 			console.log("err");
// 			res.status(500).send("Error saving, database error");
// 		} else {
// 			if (!r.rows[0].username) {
// 				res.status(403).send("Error saving, user does not exist");
// 			} else if (password != r.rows[0].password) {
// 				res.status(403).send("Error, password is not correct");
// 			} else if (user == r.rows[0].username && password == r.rows[0].password) {
// 				console.log("correct");
// 				const accessToken = jwt.sign(user, ACCESS);
// 				res.json({
// 					user: user,
// 					accessToken: accessToken,
// 				});
// 				// res.status(200).send(`Welcome ${user}`).json({ accessToken: accessToken });
// 			} else {
// 				res.status(403).send("Error, a mistake happend");
// 			}
// 		}
// 	});
// });
export default router;
