const asyncHandler = require("express-async-handler");
const adminsales = require("../models/adminSalesModel");

const admingetSalesTotalRevenue = asyncHandler(async (req, res) => {
    try {
        // Fetch all sales data
        const allSales = await adminsales.find();

        // Calculate total sales price by summing up totalPrice from each sale
        let totalRevenuePrice = 0;
        allSales.forEach(sale => {
            totalRevenuePrice += sale.totalPrice;
        });

        // Send the total sales price as JSON response
        res.status(200).json({ totalRevenue: totalRevenuePrice });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

const admingetDailySale = asyncHandler(async (req, res) => {
    try {
        // Run the aggregation pipeline to group sales by date and count the number of sales for each date
        const dailySales = await adminsales.aggregate([
          {
            $group: {
              _id:"$date",
              DailyOders:{$sum:"$order_qty"}
              ,
              DailySales:{$sum:"$totalPrice"}
            }
          },
          {
            $sort: {
              _id: -1
            }
          },
          {
            $limit: 1
          }
        ]);

        // Send the daily sales data as JSON response
        res.status(200).json(dailySales);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});




const admingetWeeklySale = asyncHandler(async (req, res) => {
    try {
        // Get the current date
        const currentDate = new Date();

        // Calculate the start date of the current week
        const startDate = new Date(currentDate);
        startDate.setDate(startDate.getDate() - startDate.getDay()); // Set to the first day of the week (Sunday)

        // Calculate the end date of the current week
        const endDate = new Date(currentDate);
        endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // Set to the last day of the week (Saturday)

        // Run the aggregation pipeline to group sales by week and count the number of sales for each week
        const weeklySales = await adminsales.aggregate([
            {
              $match: {
                date: {
                  $gte: new Date(
                    Date.now() - 8 * 24 * 60 * 60 * 1000
                  ),
                },
              },
            },
            {
              $group: {
                _id: null,
                totalOrderQty: {
                  $sum: "$order_qty",
                },
              },
            },
          ]       );

        // Send the weekly sales data as JSON response
        res.status(200).json(weeklySales);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
const admingetMonthlySale = asyncHandler(async (req, res) => {
  try {
      // Get the current date
      const currentDate = new Date();

      // Calculate the start date of the current week
      const startDate = new Date(currentDate);
      startDate.setDate(startDate.getDate() - startDate.getDay()); // Set to the first day of the week (Sunday)

      // Calculate the end date of the current week
      const endDate = new Date(currentDate);
      endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // Set to the last day of the week (Saturday)

      // Run the aggregation pipeline to group sales by week and count the number of sales for each week
      const weeklySales = await adminsales.aggregate([
        {
          "$match": {
            "date": {
              "$gte": new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          }
        },
        {
          "$group": {
            "_id": {
              "year": { "$year": "$date" },
              "month": { "$month": "$date" }
            },
            "totalOrderQty": { "$sum": "$order_qty" },
            "totalPrice": { "$sum": "$totalPrice" } // Total price calculation included in the $group stage
          }
        },
       
      ]  );

      // Send the weekly sales data as JSON response
      res.status(200).json(weeklySales);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
  }
});




const admincreateSale = asyncHandler(async (req, res) => {
    const { email_Id, date, time, order_qty, state, district, ProductName, price_per_unit, totalPrice } = req.body;
    
    if (!email_Id || !date || !time || !order_qty || !state || !district || !ProductName || !price_per_unit || !totalPrice) {
        res.status(400).json({ error: 'All fields are mandatory' });
        return;
    }

    const adminSale = await adminsales.create({
         // Set user_id based on logged-in user
        email_Id,
        date,
        time,
        order_qty,
        state,
        district,
        ProductName,
        price_per_unit,
        totalPrice
    });

    res.status(201).json(adminSale);
});

module.exports = {
    admingetSalesTotalRevenue,
    admincreateSale,
    admingetDailySale,

    admingetWeeklySale,
    admingetMonthlySale

};
