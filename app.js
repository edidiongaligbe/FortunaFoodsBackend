const mysql = require("mysql2");
const express = require("express");

const app = new express();
app.use(express.json());

var pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
  multipleStatements: true,
});

app.get("/", (req, res) => {
  res.send("Welcome to Fortuna Foods.");
});



app.get("/api/get_products/page/:pageno", (req, res) => {
  // limit as 20
  const limit = 4;
  // page number
  const page = req.params.pageno;
  // calculate offset
  const offset = (page - 1) * limit;
  // query for fetching data with page number and offset
  const prodsQuery =
    "select * from products limit " + limit + " OFFSET " + offset;

  pool.getConnection(function (err, connection) {
    connection.query(prodsQuery, function (error, results, fields) {
      connection.release();
      if (error) {
        console.log(error);
        res.statusMessage = "Unable to get products";
        res.statusCode = 500;
        res.end();
      }

      // create payload
      try {        
        var jsonResult = {
          current_page: page,
          page_count: results.length,
          products: results,
        };

        // create response
        var myJsonString = JSON.parse(JSON.stringify(jsonResult));
        res.statusMessage = "Products for page " + page;
        res.statusCode = 200;
        res.json(myJsonString);
        res.end();

      } catch (e) {

        /* Introduce proper handling of the error here */
        
        console.log(e);
        res.statusMessage = "Unable to get products";
        res.statusCode = 500;
        res.end();
      }
    });
  });
});

port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
