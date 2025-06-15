const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

function capitalizeWords(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

module.exports.index = async (req, res) => {
  let query = req.query.search;

  if (!query) {
    const allListings = await Listing.find({});
    return res.render("listings/index.ejs", { allListings });
  }
  let search = capitalizeWords(String(query));
  console.log(search);
  const allListings = await Listing.find({ country: search });
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.show = async (req, res) => {
  let { id } = req.params;
  let property = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!property) {
    req.flash("error", "Listing Not Found");
    res.redirect("/listings");
  }
  // console.log(property);
  res.render("listings/show.ejs", { property });
};

module.exports.create = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let fileName = req.path.fileName;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, fileName };
  newListing.country = capitalizeWords(req.body.listing.country);
  newListing.geometry = response.body.features[0].geometry;
  let saved = await newListing.save();
  console.log(saved);
  req.flash("success", "New Listing Created!!");

  res.redirect("/listings");
};

module.exports.update = async (req, res) => {
  let { id } = req.params;
  let editListing = await Listing.findById(id);
  if (!editListing) {
    req.flash("error", "Listing Not Found");
    res.redirect("/listings");
  }
  let originalImageUrl = editListing.image.url.replace(
    "/upload",
    "/upload/w_250"
  );
  // console.log(originalImageUrl);
  res.render("listings/edit.ejs", { editListing, originalImageUrl });
};

module.exports.edit = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "Send Valid data for listing");
  }
  req.body.listing.country = capitalizeWords(req.body.listing.country);
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let fileName = req.file.fileName;
    listing.image = { url, fileName };
    await listing.save();
  }
  req.flash("success", "Listing Updated!!");
  res.redirect(`/listings/${id}`);
};

module.exports.delete = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!!");
  res.redirect("/listings");
};
