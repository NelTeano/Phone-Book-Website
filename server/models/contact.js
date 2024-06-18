import mongoose from "mongoose";

const contactSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        phone_number: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const ContactModel = mongoose.model("Contact", contactSchema);

export default ContactModel;
