import jwt from "jsonwebtoken";

export function generateToken(user, secret) {
  return jwt.sign(
    { id: user.id, email: user.email },
    secret,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token, secret) {
  return jwt.verify(token, secret);
}