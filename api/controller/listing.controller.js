import { errorHandler } from "../utils/error.js"
import Listing from "../models/listing.model.js"
import User from "../models/user.model.js";
import Stripe from "stripe";
export const createListing = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    console.log(user);
    if (!user.availableListing > 0) {
      return next(errorHandler(400, "No listings available to create. Please purchase a plan to create listings"))
    }
    const listing = await Listing.create(req.body);
    if (listing._doc) {
      const updateUser = await User.findByIdAndUpdate(req.user.id,
        {
          availableListing: user.availableListing - 1
        },
        {
          new: true
        })
    }
    return res.status(201).json(listing);
  } catch (error) {
    next(errorHandler(500, error.message))
  }
}

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, 'Listing not found'))
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listing'))
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted')
  } catch (error) {
    next(error)
  }
}

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found'));
    }

    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, 'You can only update your own listing '))
    }
    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true })
    return res.status(200).json(updatedListing)
  } catch (error) {
    next(error)
  }
}

export const contactOwnerVerify = async (req, res, next) => {
  try {
    // Find the user by their ID (assuming req.user.id contains the logged-in user's ID)
    const user = await User.findById(req.user.id);

    // Check if the user has available contacts
    if (user && user.contactOwner.remainingContact > 0) {
      const listingId = req.params.listId;

      // Check if the listingId is already in the contactedOwner array
      if (user.contactOwner?.contactedOwner.includes(listingId)) {
        return res.status(200).json({ "remainingContact": user.contactOwner.remainingContact });
      } else {
        // Add the listingId to the contactedOwner array and reduce the availableListing count
        const updatedUser = await User.findByIdAndUpdate(
          req.user.id,
          {
            $push: { 'contactOwner.contactedOwner': listingId },  // Add listingId to contactedOwner array
            $inc: { 'contactOwner.remainingContact': -1 },  // Decrease the availableListing count by 1
          },
          { new: true }
        );

        // Check if the update was successful
        if (updatedUser) {
          return res.status(200).json({ "remainingContact": updatedUser.contactOwner.remainingContact });
        } else {
          return next(errorHandler(500, 'Failed to update user contact info.'));
        }
      }
    } else {
      // If the user has no available contacts
      return next(errorHandler(400, 'Please purchase a plan to contact the owner.'));
    }
  } catch (error) {
    // Handle any unexpected errors
    next(errorHandler(500, error.message));
  }
}

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found'))
    }

    return res.status(200).json(listing);
  } catch (error) {
    return next(error)
  }
}

export const getAllListing = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
}

export const createPaymentIntent = async (req, res, next) => {
  try {
    const stripe = Stripe(process.env.stripe_secretKey);
    let remainingContact = 0;
    switch (req.params.amount) {
      case '499':
        remainingContact = 10;
        break;
      case '799':
        remainingContact = 20;
        break;
      case '1199':
        remainingContact = 30;
        break;
      default:
        remainingContact = 0;
        break;
    }
    
    let updateUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $inc: { 'contactOwner.remainingContact': remainingContact },  // Decrease the availableListing count by 1
      }
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.params.amount,
      currency: 'usd'
    });

    const saveUser = await updateUser.save();
    res.status(200).send({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    next(error);
  }
}

