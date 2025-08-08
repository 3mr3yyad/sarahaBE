import express from "express";
import { bootStrap } from "./app.controller.js";

const app = express();
const port = 3000;

bootStrap(app, express);
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});
