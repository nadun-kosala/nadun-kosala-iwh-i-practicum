require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;


app.get("/", async (req, res) => {
  const customeObj =
    "https://api.hubspot.com/crm/v3/objects/p244170948_cars?properties=car_brand,car_color,name";
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };
  try {
    const resp = await axios.get(customeObj, { headers });

    const data = resp.data.results;

    res.render("homepage", { title: "Integrating With HubSpot I Practicum", data });
  } catch (error) {
    console.error(error);
  }
});

app.get("/update-cobj", async (req, res) => {
  try {
    res.render("updates", {
      title:
        "Update Custom Object Form | Integrating With HubSpot I Practicum.",
    });
  } catch (error) {
    console.error(error);
  }
});

app.post("/update-cobj", async (req, res) => {
  const newRecord = {
    properties: {
      name: req.body.name,
      car_brand: req.body.car_brand,
      car_color: req.body.car_color,
    },
  };

  const updateCustomObj = `https://api.hubapi.com/crm/v3/objects/p244170948_cars`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
  };

  try {
    await axios.post(updateCustomObj, newRecord, { headers });
    res.redirect("/");
  } catch (err) {
    console.error(err);
  }
});

app.listen(3000, () => console.log("Listening on http://localhost:3000"));
