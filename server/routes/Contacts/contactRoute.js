import { Router } from "express";
import ContactModel from "../../models/contact.js";

const contactRoutes = Router();

// GET ALL CONTACTS
contactRoutes.get("/contacts", async (req, res) => {
  try {
    const getContacts = await ContactModel.find({});
    res.json(getContacts);
    console.log("Successfully fetched all contacts.");
  } catch (error) {
    res.status(500).json({ message: "Fetch Contacts Failed", error });
    console.log(error);
  }
});

// CREATE CONTACT
contactRoutes.post("/create-contact", async (req, res) => {
  const { name, phone_number } = req.body;

  const contactDetails = new ContactModel({
    name,
    phone_number,
  });

  try {
    const saveContactData = await contactDetails.save();
    res.json(saveContactData);
    console.log("Successfully created a contact");
  } catch (error) {
    res.status(500).json({ message: "Contact creation failed", error });
    console.log("Failed creating a contact", error);
  }
});


// DELETE CONTACT
contactRoutes.delete("/delete-contact/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedContact = await ContactModel.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json({ message: "Contact deleted successfully" });
    console.log("Successfully deleted the contact");
  } catch (error) {
    res.status(500).json({ message: "Delete contact failed", error });
    console.log("Failed deleting the contact", error);
  }
});

contactRoutes.delete("/delete", async (req, res) => {
  const { name, phone_number } = req.body;

  try {
    const deletedContact = await ContactModel.findOneAndDelete({ name, phone_number });

    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json({ message: "Contact deleted successfully" });
    console.log("Successfully deleted the contact");
  } catch (error) {
    res.status(500).json({ message: "Delete contact failed", error });
    console.log("Failed deleting the contact", error);
  }
});


// EDIT CONTACT
contactRoutes.put("/edit-contact/:id", async (req, res) => {
  const { id } = req.params;
  const { name, phone_number } = req.body;

  try {
    const updatedContact = await ContactModel.findByIdAndUpdate(
      id,
      { name, phone_number },
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json(updatedContact);
    console.log("Successfully updated the contact");
  } catch (error) {
    res.status(500).json({ message: "Update contact failed", error });
    console.log("Failed updating the contact", error);
  }
});







export default contactRoutes;
