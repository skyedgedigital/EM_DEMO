"use server";

import connectToDB from "@/lib/database";
import Consumable from "@/lib/models/consumables.model";

let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let years = ["2024", "2025", "2026", "2027", "2028", "2029", "2030"];

const createConsumables = async (dataString: string) => {
  try {
    await connectToDB();
    let dataObj = JSON.parse(dataString);
    const dateField = new Date(dataObj.date);
    const month = months[dateField.getMonth()];
    const year = String(dateField.getFullYear());
    dataObj.month = month;
    dataObj.year = year;
    dataObj.DocId = month+year
    const newConsumable = new Consumable({ ...dataObj });
    const resp = await newConsumable.save();

    return {
      success: true,
      status: 200,
      message: "Consumable saved",
      data: JSON.stringify(resp),
    };
  } catch (err) {
    return {
      err: JSON.stringify(err),
      success: false,
      status: 500,
      message: "Error saving consumable",
    };
  }
};

export { createConsumables };
