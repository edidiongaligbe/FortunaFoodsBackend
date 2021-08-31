const mysql = require("mysql2");
const express = require("express");

const app = new express();
app.use(express.json());


/* const conn = mysql.createConnection({
  user: "root",
  password: "app@12345",
  database: "fortuna_foods",
}); */

var pool  = mysql.createPool({
  connectionLimit : 10,
  host: "localhost",
  user: "root",
  password: "app@12345",
  database: "fortuna_foods",
  multipleStatements: true
}); 

app.get("/", (req, res) => {
  res.send("Welcome to Fortuna Foods.");
});

/* app.get("/api/test", (req, res) => {

  conn.promise().execute("SELECT * FROM products")
  .then( ([rows,fields]) => {
    if (rows.length == 0){
      res.status(200).json({products:'No products in the database'})
    } else {
       console.log(rows.length)
      res.status(200).json({ products: rows });
    }      
    
  })
  .catch(console.log)
  .then( () => conn.end());

 
}); */

app.get("/api/get_products/page/:pageno", (req, res) => {

  // limit as 20
  const limit = 4
  // page number
  const page = req.params.pageno
  // calculate offset
  const offset = (page - 1) * limit
  // query for fetching data with page number and offset
  const prodsQuery = "select * from products limit "+limit+" OFFSET "+offset

  pool.getConnection(function(err, connection) {
    connection.query(prodsQuery, function (error, results, fields) {
      connection.release();
           if (error) throw error;
      // create payload
      var jsonResult = {
        'current_page':page,
        'page_count':results.length,        
        'products':results
      }
      // create response
      var myJsonString = JSON.parse(JSON.stringify(jsonResult));
      res.statusMessage = "Products for page "+page;
      res.statusCode = 200;
      res.json(myJsonString);
      res.end();
    })
  })

 
});




port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
