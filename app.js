const express = require('express')
 var app = express(); 

const mysql = require('mysql2');
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'app@12345',
    database: 'fortuna_foods'
});

port = process.env.PORT || 3000;
app.use(express.json);

conn.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
    conn.query("select * from users", (err,result) => {
        if(err) throw err;
        console.log(result);
    })
  });


/* app.get("/api/querypayment/:id", (req, res) => {
    client.connect(err => {
      if (err) {
        res.send(err.message);
        return;
      }
      let ObjectId = require("mongodb").ObjectID;
      let id = req.params.id;
      console.log(id);
      const collection = client.db("EkoBot").collection("EkoCustPayments");
      collection.find(ObjectId(id)).toArray((errr, results) => {
        res.json({ payment: results[0] });
      });
      
    });
  });
 */


app.listen(port, () => {
    console.log(`App listening on ${port}`);
});
