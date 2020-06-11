const express = require("express");
const passport = require("passport");
const validateCreatePumpInput = require("../../validation/createPump")
const validateNearestPumpInput = require("../../validation/nearestPump")
const validateBookPumpInput = require("../../validation/bookPump")
const router = express.Router();

const Pump = require("../../models/Pump")
const Booking = require("../../models/Booking")

// @routes     GET api/pumps/healthcheck
// @desc       Tests pumps routes
// @access     Public
router.get("/healthcheck", (req, res) => res.json({ pumps: "Pumps Working" }));

// @routes     GET api/pumps
// @desc       Get all pumps
// @access     Private
router.get("/", 
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        // Fetch all Pumps and return
        Pump.find()
        .sort({ date: -1 })
        .then(pumps => res.json(pumps))
        .catch(err => res.status(404).json({ nopumpfound: "No pumps found" }));
});

// @routes     POST api/pumps
// @desc       Create Pump
// @access     Private
router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        // Validation
        const { errors, isValid } = validateCreatePumpInput(req.body);
    
        if (!isValid) {
            // Return with status 400 along with errors
            return res.status(400).json(errors);
        }
        
        // Create a Pump Object
        const newPump = new Pump({
            name: req.body.name,
            landmark: req.body.landmark,
            fillings: req.body.fillings.map(filling => filling.toLowerCase()),
            location: {
                type: "Point",
                coordinates: [req.body.latitude, req.body.longitude]
            }
        });

        // Save the Pump to database
        newPump
            .save()
            .then(pump => res.json(pump))
            .catch(err => res.status(400).json({error: 'Error occured while creating Pump'}))

    }
);

// @routes     GET api/pumps/nearest
// @desc       Get nearest pump
// @access     Private
router.get("/nearest",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        // Validation
        const { errors, isValid } = validateNearestPumpInput(req.body);
    
        if (!isValid) {
            // Return with status 400 along with errors
            return res.status(400).json(errors);
        }

        // Find the nearest pump using Geospatial Query
        Pump.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [req.body.latitude, req.body.longitude]
                    }
                }
            }
        })
        // Further find Pump which fits our requirement
        .findOne({
            fillings: { $all: req.body.fillings.map(filling => filling.toLowerCase()) }
        })
        .then(pump => {
            if (!pump) {
                res.json({message: 'No pump exist which fits your requirement'})
            }
            res.json(pump);
        })
        .catch(err => res.status(400).json({error: 'Error occured while Fetching Pump'}))

});

// @routes     POST api/pumps/book
// @desc       Book oil from pump
// @access     Private
router.post("/book",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        // Validation
        const { errors, isValid } = validateBookPumpInput(req.body);
    
        if (!isValid) {
            // Return with status 400 along with errors
            return res.status(400).json(errors);
        }
        
        // Find the nearest pump using Geospatial Query
        Pump.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [req.body.latitude, req.body.longitude]
                    }
                }
            }
        })
        // Further find Pump which fits our requirement
        .findOne({
            fillings: { $all: req.body.fillings.map(filling => filling.toLowerCase()) }
        })
        .then(pump => {
            // Book the fillings for nearest pump
            if (!pump) {
                res.json({message: 'No pump exists which fits your requirement'})
            }
            
            // Create booking object
            const newBooking = new Booking({
                user: req.user,
                pump: pump,
                fillings: req.body.fillings.map(filling => filling.toLowerCase())
            });

            // Save the booking to database
            newBooking
                .save()
                .then(booking => res.json(booking))
                .catch(err => console.log(err))

        })
        .catch(err => res.status(400).json({error: 'Error occured while Fetching Pump'}))

});

// @routes     GET api/pumps/bookings
// @desc       Get booking details
// @access     Private
router.get("/bookings/:pump_id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        // Fetch all Pumps and return
        Booking.find({pump: req.params.pump_id})
            .populate('user', ['_id', 'name', 'email'])
            .populate('pump', ['_id', 'location', 'fillings', 'name', 'landmark'])
            .sort({ date: -1 })
            .then(pumps => res.json(pumps))
            .catch(err => res.status(404).json({ nobookingfound: "No Bookings found" }));
});

module.exports = router;