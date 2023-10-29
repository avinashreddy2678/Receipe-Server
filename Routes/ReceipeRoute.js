import express from "express";
import { verifyToken } from "./UserRouter.js";
import { ReceipeModal } from "../Models/ReceipeModal.js";
import { UserModal } from "../Models/UserModal.js";

const router = express.Router();

//sending data to client all data
router.get("/", async (req, res) => {
  try {
    const response = await ReceipeModal.find({});
    return res.status(201).json({ response });
  } catch (error) {
    console.log(error);
  }
});
//userdetails for store
router.get("/:userid", async (req, res) => {
  const userId = req.params.userid; // Use req.params.userid to access the userid parameter.

  try {
    const response = await UserModal.findOne({ _id: userId }).select(
      "-_id -username -email -password"
    );
    res.json(response);
  } catch (error) {
    // Handle any errors that occur during the database query.
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve user data" });
  }
});

//myrecepies
router.get("/myrecepies/:userid", async (req, res) => {
  let { userid } = req.params;
  try {
    const response = await UserModal.findOne({ _id: userid });
    return res.status(201).json({ response: response.Myreceipes });
  } catch (error) {
    console.log(error);
  }
});

//particular user all recepies
router.get("/allreceipes/:id", async (req, res) => {
  let { id } = req.params;
  try {
    const response = await ReceipeModal.find({ creatorid: id });

    return res.status(201).json({ response: response });
  } catch (error) {
    console.log(error);
  }
});

//saving to user
router.put("/saved", async (req, res) => {
  try {
    const { userid, _id } = req.body;
    const receipe = await ReceipeModal.findOne({ _id });
    const user = await UserModal.findOne({ _id: userid });
    receipe.Saved.unshift(user._id);
    user.Saved.unshift(receipe);
    await user.save();
    await receipe.save();
    return res.status(201).json({ message: "saved item" });
  } catch (error) {
    console.log(error);
  }
});
//  liking the pics  array
router.put("/like", async (req, res) => {
  try {
    const { userid, _id } = req.body;
    const receipe = await ReceipeModal.findOne({ _id });
    const user = await UserModal.findOne({ _id: userid });
    receipe.Liked.unshift(user._id);
    user.Liked.unshift(receipe);
    await user.save();
    await receipe.save();
    return res.status(201).json({ message: "Liked item" });
  } catch (error) {
    console.log(error);
  }
});

//remove from saving to user
router.delete("/saved", async (req, res) => {
  try {
    const { userid, _id } = req.query;
    const receipe = await ReceipeModal.findOne({ _id });
    const user = await UserModal.findOne({ _id: userid });
    user.Saved.splice(receipe._id, 1);
    receipe.Saved.splice(user._id, 1);
    await user.save();
    await receipe.save();
    return res.status(201).json({ message: " removed from item" });
  } catch (error) {
    console.log(error);
  }
});



//deleting the receipes which is created by the user



// removing the liking the pics  array

router.delete("/like", async (req, res) => {
  try {
    const { userid, _id } = req.query;

    // Find the Receipe by _id
    const receipe = await ReceipeModal.findOne({ _id });

    // Find the User by _id
    const user = await UserModal.findOne({ _id: userid });

    const userIdString = String(user._id);
    const receipeIdString = String(receipe._id);

    // Find the index of the userIdString in the receipe.Liked array
    const userIndexInReceipeLiked = receipe.Liked.findIndex(
      (id) => String(id) === userIdString
    );

    // Find the index of the receipeIdString in the user.Liked array
    const receipeIndexInUserLiked = user.Liked.findIndex(
      (id) => String(id) === receipeIdString
    );

    receipe.Liked.splice(userIndexInReceipeLiked, 1);
    user.Liked.splice(receipeIndexInUserLiked, 1);

    await user.save();
    await receipe.save();

    return res.status(201).json({ message: "Removed Liked item" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//All liked pics to get liked
router.get("/liked/:userid", async (req, res) => {
  try {
    const { userid } = req.params;
    const user = await UserModal.findById(userid);
    const Liked = await ReceipeModal.find({
      _id: { $in: user.Liked },
    });
    return res.json({ message: "done", Liked });
  } catch (err) {
    console.log(err);
  }
});

//to get saved

router.get("/saved/:userid", async (req, res) => {
  try {
    const { userid } = req.params;
    const user = await UserModal.findById(userid);
    const saved = await ReceipeModal.find({
      _id: { $in: user.Saved },
    });
    return res.json({ message: "done", saved });
  } catch (err) {
    console.log(err);
  }
});

//Creating a new recipe

router.post("/create/:userid", verifyToken, async (req, res) => {
  const { type, name, imgurl, ingrediants, description, time, creatorname } =
    req.body;
  const userid = req.params.userid;
  const user = await UserModal.findOne({ _id: userid });
  try {
    // Create a new recipe document

    const additem = new ReceipeModal({
      name,
      type,
      imgurl,
      ingrediants,
      description,
      time,
      creatorid: userid,
      creatorname, // Associate the recipe with the user
    });
    user.Myreceipes.unshift(additem);
    // Save the new recipe to the database
    await additem.save();
    await user.save();
    res.status(201).json({ message: "Recipe created successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the recipe" });
  }
});

//Getting receipe complete info based on the click

router.get("/receipe/:id", async (req, res) => {
  console.log(id)
  try {
    const response = await ReceipeModal.findOne({ _id: id });
    return res.json({ response });
  } catch (error) {
    console.log(error);
  }
});

export { router as receiperouter };
