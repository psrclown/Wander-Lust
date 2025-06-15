const Listing = require("../models/listing");

module.exports.category = async (req, res) => {
  let option = req.params.cat;
  const allListings = await Listing.find({ category: option });
  res.render("listings/index.ejs", { allListings });
};
