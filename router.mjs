import { Router } from "express";
const router = Router();
import * as dotenv from "dotenv";
import client from "./db.mjs";
dotenv.config();
// ROUTES;

/// test

const getAllPosts = (client) => async (req, res) => {
	await client.connect((err) => {
		if (err) {
			console.log(err);
		} else {
			console.log("Connected to server, well done!");
		}
	});

	await client.query(
		`select title, body from posts ;`,
		// `INSERT INTO users (username, password ) VALUES ($1, $2) RETURNING * `,

		(error, results) => {
			if (error) {
				res.status(500).json({ error: "Something broke!" });
			}
			res.status(201).json(results.rows);
		},
	);
};
//

import routerUser from "./routes/users.mjs";
import routerLogin from "./routes/login.mjs";
import routerRegister from "./routes/register.mjs";
import authRegister from "./routes/auth.mjs";
import routerLobby from "./routes/lobby.mjs";
//
router.use("/users", routerUser);
router.use("/lobby", routerLobby);
router.use("/login", routerLogin);
router.use("/register", routerRegister);
router.use("/test", authRegister);

router.get("/posts", getAllPosts(client), (req, res) => {});

export default router;
