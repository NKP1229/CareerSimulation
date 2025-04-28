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
const getUser = async (req, res, next) => {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  req.user = jwt.verify(token, JWT_SECRET);
  const response = await prisma.user.findFirst({
    where: {
      id: req.user?.id,
    },
  });
  res.send({ response });
};

const getAllItems = async (req, res, next) => {
  const response = await prisma.item.findMany();
  res.send({ response });
};
const getItem = async (req, res, next) => {
  const response = await prisma.item.findFirst({
    where: {
      id: req.params.itemId,
    },
  });
  res.send({ response });
};
const getItemReviews = async (req, res, next) => {
  const response = await prisma.review.findMany({
    where: {
      itemId: req.params.itemId,
    },
  });
  res.send({ response });
};

const getAReview = async (req, res, next) => {
  const response = await prisma.review.findFirst({
    where: {
      id: req.params.reviewId,
      itemId: req.params.itemId,
    },
  });
  res.send({ response });
};
const writeAReview = async (req, res, next) => {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  req.user = jwt.verify(token, JWT_SECRET);

  const response = await prisma.review.create({
    data: {
      userId: req.user?.id,
      itemId: req.params.itemId,
      rating: req.body.rating,
    },
  });
  res.status(201).send({ response });
};
const getMyReviews = async (req, res, next) => {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  req.user = jwt.verify(token, JWT_SECRET);
  const response = await prisma.review.findMany({
    where: {
      userId: req.user?.id,
    },
  });
  res.status(201).send({ response });
};
const updateAReview = async (req, res, next) => {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  req.user = jwt.verify(token, JWT_SECRET);
  if (req.user?.id !== req.params.userId) {
    res.send("Please log in.");
  } else {
    const response = await prisma.review.update({
      where: {
        id: req.params.reviewId,
      },
      data: {
        rating: req.body.rating,
      },
    });
    res.status(201).send({ response });
  }
};

const writeAComment = async (req, res, next) => {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  req.user = jwt.verify(token, JWT_SECRET);
  const response = await prisma.comment.create({
    data: {
      reviewId: req.params.reviewId,
      text: req.body.text,
      userId: req.user?.id,
    },
  });
  res.status(201).send({ response });
};
const getMyComments = async (req, res, next) => {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  req.user = jwt.verify(token, JWT_SECRET);
  const response = await prisma.comment.findMany({
    where: {
      userId: req.user?.id,
    },
  });
  res.status(201).send({ response });
};
const UpdateAComment = async (req, res, next) => {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  req.user = jwt.verify(token, JWT_SECRET);
  if (req.user?.id !== req.params.userId) {
    res.send("Please log in.");
  } else {
    const response = await prisma.comment.update({
      where: {
        id: req.params.commentId,
      },
      data: {
        text: req.body.text,
      },
    });
    res.status(201).send({ response });
  }
};

module.exports = {
  createUser,
  userLogIn,
  getUser,
  getAllItems,
  getItem,
  getItemReviews,
  getAReview,
  writeAReview,
  getMyReviews,
  updateAReview,
  writeAComment,
  getMyComments,
  UpdateAComment,
};
