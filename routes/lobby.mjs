import express from "express";
import client from "../db.mjs";
import { hashPass } from "../utils/auth.mjs";
const router = express.Router();

// LOBBY POSTS
const getAllLobbyPosts = (client) => async (req, res) => {
	try {
		// await client.connect((err) => {
		// 	if (err) {
		// 		console.log(err);
		// 	} else {
		// 		console.log("Connected to server, well done!");
		// 	}
		// });

		await client.query(
			`select posts.title, posts.body, users.username from lobby
			join posts
			on posts.lobby_id = lobby.id
			join users
			on posts.user_id = users.id
			`,
			// `INSERT INTO users (username, password ) VALUES ($1, $2) RETURNING * `,

			(error, results) => {
				if (error) {
					res.status(401).json({ error: "Something broke in all posts!" });
				}
				res.status(201).json(results.rows);
			},
		);
	} catch (e) {}
};
const getLobbyPost = (client) => async (req, res) => {
	const lobbyRoom = req.params.id;
	try {
		await client.query(
			`select posts.title, posts.body, users.username from lobby
			join posts
			on posts.lobby_id = lobby.id
			join users
			on posts.user_id = users.id
			where posts.lobby_id = ${lobbyRoom};`,
			(error, results) => {
				if (error) {
					res.status(500).json({ error: "Something broke in getting lobby post!" });
				}
				res.status(201).json(results.rows);
			},
		);
	} catch (e) {
		console.log(e);
	}
};

router.post("/new", async (req, res) => {
	try {
		const lobby_admin = 2; // placeholder
		const createLobby = await client.query(
			`INSERT INTO lobby (lobby_admin ) VALUES ($1) RETURNING * `,
			[lobby_admin],

			async (error, results) => {
				if (error) {
					res.status(400);
					console.log(res);
					res.json({ message: "Mandatory field: name is missing. " });
				} else {
					console.log("yooo");
				}
			},
		);

		const user2lobby = await client.query(
			`INSERT INTO user2lobby (user_id,lobby_id ) VALUES ($1,$2) RETURNING * `,
			[lobby_admin, 2],
			(error, results) => {
				if (error) {
					res.status(401).json({ error: "Something is broken!" });
				}
				if (results) {
					res.status(201).json(results.rows);
				} else {
					res.send("error somewhere");
				}
			},
		);
	} catch (e) {
		console.log(e);
	}
});

router.get("/new", async (req, res) => {
	try {
		res.send("Hey, no new lobby here");
	} catch (e) {
		console.log(e);
		res.status(400);
		res.json({ message: "Mandatory field: name is missing. " });
	}
});

router.get("/", getAllLobbyPosts(client), async (req, res) => {});
router.get("/:id", getLobbyPost(client), async (req, res) => {});

router.post("/:id", async (req, res) => {
	const lobbyRoom = req.params.id;
	const { title, body } = req.body;

	await client.query(
		`INSERT INTO posts (title,body,user_id,lobby_id ) VALUES ($1,$2,$3,$4) RETURNING *`,
		[title, body, 1, lobbyRoom],

		(error, results) => {
			if (error) {
				res.status(500).json({ error: "Something broke!" });
			}
			res.status(201).json(results.rows);
		},
	);
});

/// new lobby creation

export default router;
