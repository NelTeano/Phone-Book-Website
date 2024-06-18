import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import contactRoute from "../server/routes/Contacts/contactRoute.js"; // Adjust the path if needed
import { initDatabase } from "./database.js"; // Adjust the path if needed

dotenv.config();
initDatabase();

const app = express();
const PORT = 5001;

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://127.0.0.1:5173'
    ],
    credentials: true,
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use("/api", contactRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
