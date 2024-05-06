const asyncHandler = require("express-async-handler");

const Contact = require("../models/contactModel")

// @desc Get all contacts
//@route GET/api/contacts
//@access private


const getContacts = asyncHandler(async (req, resp) => {
    const contacts = await Contact.find({ user_id: req.userExecutive.id });
    resp.status(200).json(contacts)
});

// @desc GET all contacts
//@route GET/api/contacts/:id
//@access public
const getContact = asyncHandler(async (req, resp) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        resp.status(404);
        throw new Error("contact not found");
    }

    resp.status(200).json(contact);
});


// @desc Create all contacts
//@route POST/api/contacts
//@access public


const createContact = asyncHandler(async (req, resp) => {
    console.log("The request body is :", req.body);
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        resp.status(400);
        throw new Error("All fields are mandatory !")

    }
    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.userExecutive.id
    });
    resp.status(201).json(contact)
})



// @desc update all contacts
//@route get/api/contacts
//@access public

const updateContact = asyncHandler(async (req, resp) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        resp.status(404);
        throw new Error("contact not found")

    }

    if (contact.user_id.toString() !== req.userExecutive.id) {
        resp.status(403);
        return resp.json({ error: "User doesn't have permission to update other user's contacts" });
    }
    const updateContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    resp.status(200).json(updateContact)
})

// @desc delete all contacts
//@route delete/api/contacts/:id
//@access public

const deleteContact = asyncHandler(async (req, resp) => {

    const contactDel = await Contact.findById(req.params.id);

    if (!contactDel) {
        resp.status(404);
        throw new Error("contact not found")

    }

    if(contactDel .user_id.toString() !== req.userExecutive.id)
    {
        resp.status(403);
        throw new Error("User dont't have permission to other user contacts");
    }

    await Contact.deleteOne({ _id: req.params.id });




    resp.status(200).json(contactDel);
});



module.exports = { getContacts, getContact, createContact, updateContact, deleteContact }