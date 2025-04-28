const express = require("express");
const app = express();
const PORT = 3000;
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "1234";
app.use(express.json());

const {
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
  deleteReview,
  deleteComment,
} = require("./db");

app.listen(PORT, (req, res, next) => {
  console.log(`I am listening on port number ${PORT}`);
});

app.post("/api/auth/register", async (req, res, next) => {
  try {
    await createUser(req, res, next);
  } catch (error) {
    next(error);
  }
});
app.post("/api/auth/login", async (req, res, next) => {
  try {
    await userLogIn(req, res, next);
  } catch (error) {
    next(error);
  }
});
app.get("/api/auth/me", async (req, res, next) => {
  try {
    await getUser(req, res, next);
  } catch (error) {
    next(error);
  }
});

app.get("/api/items", async (req, res, next) => {
  try {
    await getAllItems(req, res, next);
  } catch (error) {
    next(error);
  }
});
app.get("/api/items/:itemId", async (req, res, next) => {
  try {
    await getItem(req, res, next);
  } catch (error) {
    next(error);
  }
});
app.get("/api/items/:itemId/reviews", async (req, res, next) => {
  try {
    await getItemReviews(req, res, next);
  } catch (error) {
    next(error);
  }
});

app.get("/api/items/:itemId/reviews/:reviewId", async (req, res, next) => {
  try {
    await getAReview(req, res, next);
  } catch (error) {
    next(error);
  }
});
app.post("/api/items/:itemId/reviews", async (req, res, next) => {
  try {
    await writeAReview(req, res, next);
  } catch (error) {
    next(error);
  }
});
app.get("/api/reviews/me", async (req, res, next) => {
  try {
    await getMyReviews(req, res, next);
  } catch (error) {
    next(error);
  }
});
app.put("/api/users/:userId/reviews/:reviewId", async (req, res, next) => {
  try {
    await updateAReview(req, res, next);
  } catch (error) {
    next(error);
  }
});

app.post(
  "/api/items/:itemId/reviews/:reviewId/comments",
  async (req, res, next) => {
    try {
      await writeAComment(req, res, next);
    } catch (error) {
      next(error);
    }
  }
);
app.get("/api/comments/me", async (req, res, next) => {
  try {
    await getMyComments(req, res, next);
  } catch (error) {
    next(error);
  }
});
app.put("/api/users/:userId/comments/:commentId", async (req, res, next) => {
  try {
    await UpdateAComment(req, res, next);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/users/:userId/comments/:commentId", async (req, res, next) => {
  try {
    await deleteComment(req, res, next);
  } catch (error) {
    next(error);
  }
});
app.delete("/api/users/:userId/reviews/:reviewId", async (req, res, next) => {
  try {
    await deleteReview(req, res, next);
  } catch (error) {
    next(error);
  }
});
