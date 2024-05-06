const asyncHandler = require("express-async-handler");
const axios = require('axios');
const PanShopOwner = require("../models/panShopModel");
const fs = require('fs');

const qrcode = require('qrcode');

function validatePhoneNumber(phoneNumber) {
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneno.test(phoneNumber);
}


const createPanShopOwner = asyncHandler(async (req, res) => {
    const { panShopOwner, phoneNumber, address, latitude, longitude  } = req.body;

    

    if (!panShopOwner || !phoneNumber || !address || !latitude || !longitude ) {
        return res.status(400).json({ error: "panShopOwner, phoneNumber, address, latitude longitude are mandatory fields" });
    }

    if (!validatePhoneNumber(phoneNumber)) {
        return res.status(400).json({ error: "Invalid phone number format" });
    }
    

    try {

        const existingOwner = await PanShopOwner.findOne({ phoneNumber });

        if (existingOwner) {
            return res.status(400).json({ error: "Phone number already exists" });
        }
        // Create the pan shop owner 
        const owner = await PanShopOwner.create({
            panShopOwner,
            phoneNumber,
            address,
            latitude,
            longitude,
            user_id: req.userExecutive.id // Make sure this is correct
        });


        const qrData = JSON.stringify({
            Id :owner._id,
            panShopOwner: owner.panShopOwner
        });
        // Generate and store the QR code
        const qrImageFilePath =` qr_${owner._id}.png`; // File path for the QR code image
        await qrcode.toFile(qrImageFilePath, qrData);

        // Read the QR code image file as a buffer
        const qrImageData = fs.readFileSync(qrImageFilePath);

        // Delete the QR code image file after reading it
        fs.unlinkSync(qrImageFilePath);

        // Store the QR code image data in the owner object
        owner.qrCodeImage = {
            data: qrImageData,
            contentType: 'image' // Adjust according to the image format
        };
        await owner.save();
        const qrCodeBase64 = qrImageData.toString('base64');
        res.status(201).json({ qrCodeBase64 ,owner});
    } catch (error) {
        // If an error occurs during the creation process, send an error response
        console.error(error);
        res.status(500).json({ error: "Failed to create pan shop owner" });
    }
});


const updatePanShoperOwner = asyncHandler(async(req,res) => {
    try {
        // Find the pan shop owner by ID
        const ownerId = await PanShopOwner.findById(req.params.id);
        
        // Check if the pan shop owner exists
        if (!ownerId) {
            res.status(404);
            throw new Error("Pan shop owner not found");
        }
        
        // Check if the requesting user has permission to update the pan shop owner
        if (ownerId.user_id.toString() !== req.userExecutive.id) {
            res.status(403);
            return res.json({ error: "User doesn't have permission to update other user's pan shop owners" });
        }
        if (!validatePhoneNumber(req.body.phoneNumber)) {
            return res.status(400).json({ error: "Invalid phone number format" });
        }
        const existingOwner = await PanShopOwner.findOne({ phoneNumber: req.body.phoneNumber });
        if (existingOwner && existingOwner._id.toString() !== req.params.id) {
            return res.status(400).json({ error: "Phone number already exists" });
        }
        // Update the pan shop owner with the provided data
        const owner = await PanShopOwner.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        
        const qrData = JSON.stringify({
            Id :owner._id,
            panShopOwner: owner.panShopOwner,

        });
        const qrImageFilePath =` qr_${owner._id}.png`;
        await qrcode.toFile(qrImageFilePath, qrData);
        const qrImageData = fs.readFileSync(qrImageFilePath);
        fs.unlinkSync(qrImageFilePath);

        // Update the pan shop owner with the new QR code
        owner.qrCodeImage = {
            data: qrImageData,
            contentType: 'image'
        };
        await owner.save();

        const qrCodeBase64 = qrImageData.toString('base64');

        // Return the updated pan shop owner
        res.status(201).json({ qrCodeBase64 ,owner });
    } catch (error) {
        // If an error occurs during the update process, send an error response
        console.error(error);
        res.status(500).json({ error: "Failed to update pan shop owner" });
    }
});

const deletePanShopOwner = asyncHandler(async (req, res) => {

    const owner = await PanShopOwner.findById(req.params.id);

    if (!owner) {
        res.status(404);
        throw new Error("product not found")

    }

    if(owner.user_id.toString() !== req.userExecutive.id)
    {
        res.status(403);
        throw new Error("User dont't have permission to other user products");
    }

    await PanShopOwner.deleteOne({ _id: req.params.id });




    res.status(200).json(owner);
});

const getPanShopOwnerById = asyncHandler(async (req, resp) => {
    const owner = await PanShopOwner.findById(req.params.id);
    if (!owner) {
        resp.status(404);
        throw new Error("PanShop Owner Not Found");
    }
    
    // Generate QR code data
    const qrData = JSON.stringify({
        Id :owner._id,
        panShopOwner: owner.panShopOwner,
    });
    
    // Generate QR code image
    const qrImageFilePath = `qr_$owner._id}.png`; // File path for the QR code image
    await qrcode.toFile(qrImageFilePath, qrData);

    // Read the QR code image file as a buffer
    const qrImageData = fs.readFileSync(qrImageFilePath);

    // Delete the QR code image file after reading it
    fs.unlinkSync(qrImageFilePath);

    // Convert QR code image data to base64
    const qrCodeBase64 = qrImageData.toString('base64');

    // Store the QR code image data in the pan shop owner object
    owner.qrCodeImage = {
        data: qrImageData,
        contentType: 'image/png' // Adjust according to the image format
    };

    // Send the pan shop owner details along with the base64 representation of the QR code
    resp.status(200).json({ qrCodeBase64, owner });
});

const getAllPanShopOwner = asyncHandler(async (req, resp) => {
    const shop = await PanShopOwner.find({ user_id: req.userExecutive.id });
    resp.status(200).json(shop)
});


module.exports = { createPanShopOwner ,updatePanShoperOwner ,deletePanShopOwner,getAllPanShopOwner ,getPanShopOwnerById};