import express from "express";
import client from "../db.mjs";
const router = express.Router();

router.get("/", (req, response) => {
	console.log("I'm connected to users");

	client.connect((err) => {
		if (err) {
			console.log(err);
		} else {
			console.log("pat on the back");
		}
	});

	client.query("SELECT * FROM user_accounts", (err, res) => {
		if (err) throw err;
		response.send({ response: res });
		client.end();
	});
});
export default router;
