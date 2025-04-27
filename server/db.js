const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/block37"
);
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const JWT_SECRET = process.env.JWT_SECRET || "1234";
const jwt = require("jsonwebtoken");
const { prisma } = require("./common");

const createUser = async (req, res, next) => {
  const hashedPass = await bcrypt.hash(req.body.password, 5);
  const response = await prisma.user.create({
    data: {
      username: req.body.username,
      password: hashedPass,
    },
  });
  const token = jwt.sign({ id: response.id }, JWT_SECRET, {
    expiresIn: "8h",
  });
  res.status(201).send({ token });
};
const userLogIn = async (req, res, next) => {
  const response = await prisma.user.findFirst({
    where: {
      username: req.body.username,
    },
  });
  const match = await bcrypt.compare(req.body.password, response.password);
  if (match) {
    const token = jwt.sign({ id: response.id }, JWT_SECRET, {
      expiresIn: "8h",
    });
    res.send({ token });
  } else {
    res.send("incorrect username or password");
  }
};

module.exports = {
  client,
  createUser,
  userLogIn,
};
