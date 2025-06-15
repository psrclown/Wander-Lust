const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/reviews.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const reviewsController = require("../controller/reviews.js");

const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");

// Reviews

router.post(
  "/",
  validateReview,
  isLoggedIn,
  wrapAsync(reviewsController.writeReview)
);

//Delete Reviews
router.delete(
  "/:reviewId",
  isReviewAuthor,
  wrapAsync(reviewsController.delReview)
);

module.exports = router;
