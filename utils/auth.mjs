import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
//
export const comparePass = (password, hash) => {
	return bcrypt.compare(password, hash);
};

export const hashPass = (password) => {
	return bcrypt.hash(password, 5);
};

export const createJWT = (user) => {
	const token = jwt.sign(
		{
			id: user.id,
			username: user.username,
		},
		process.env.JWT_SECRET,
	);
	return token;
};

export const protectY = (req, res, next) => {
	const bearer = req.headers.authorization;

	if (!bearer) {
		res.status(401);
		res.json({ message: "You have no token, go back" });
		return;
	}

	const [, token] = bearer.split(" ");

	if (!token) {
		console.log("token check");
		res.status(401);
		res.json({ message: "You have token issues" });
		return;
	}
	try {
		const user = jwt.verify(token, process.env.JWT_SECRET);
		req.user = user;
		next();
	} catch (e) {
		console.log(e);
		res.status(401);
		res.json({ message: "Other issues" });
		return;
	}
};
