import express from "express";
import client from "../db.mjs";
import { hashPass } from "../utils/auth.mjs";

const router = express.Router();

const createNewUser = (client) => async (req, res) => {
	const user = await req.body.user;
	const password = await hashPass(req.body.password);
	await client.connect((err) => {
		if (err) {
			console.log(err);
		} else {
			console.log("Connected to server, well done!");
		}
	});

	await client.query(
		`INSERT INTO users (username, password ) VALUES ($1, $2) RETURNING * `,
		[user, password],

		(error, results) => {
			if (error) {
				res.status(500).json({ error: "Something broke!" });
			}
			res.status(201).send(`User added with ID: ${results.rows[0].username}`);
		},
	);
};

router.post("/", createNewUser(client), async (req, res, next) => {});

export default router;
