const express = require("express");
const mysql2 = require("mysql2/promise");
const ejs = require("ejs");
const expressLayouts = require('express-ejs-layouts');
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "./views");
app.set('layout', 'layout');
app.locals.pageTitle = 'Food Entries';
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true })); 

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dateStrings: true,
    port: process.env.DB_PORT
}

const dbConnection = mysql2.createPool(dbConfig);

app.get("/", (req, res) => {
    res.render("index")
});

app.get("/food-entry/create", function(req,res){
    res.render('create-food-entry', { pageTitle: 'Add Food Entry' });
})

app.post('/food-entry/create', async (req, res) => {
    const { dateTime, foodName, calories, servingSize, unit } = req.body;
    const query = `INSERT INTO food_entries
    (dateTime, foodName, calories, servingSize, unit)
    VALUES (?, ?, ?, ?, ?)`;
    const values = [dateTime, foodName, calories, servingSize, unit];
    await dbConnection.execute(query, values);
    res.redirect("/");
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});