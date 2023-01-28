const express = require("express");
const app = express();
const mySql = require("mysql2");

const query = mySql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "assignments",
});

app.use(express.json());

// get all user
app.get("/getusers", (req, res) => {
  query.execute(`select * from users`, (err, data) => {
    res.json(data);
  });
});
// add user
app.post("/adduser", (req, res) => {
  let { name, email, age, password } = req.body;
  query.execute(`select * from users where email = '${email}'`, (err, data) => {
    if (data.length == 0) {
      query.execute(
        `insert into users (name,email,age,password) values ('${name}','${email}','${age}','${password}')`
      );
      res.send({ message: "added" });
    } else {
      res.send({ message: "user already exist" });
    }
  });
});
// update user
app.put("/update", (req, res) => {
  let { name, id } = req.body;
  query.execute(`select * from users where id = ${id}`, (err, data) => {
    if (data.length == 0) {
      res.send({ message: "user dont exist " });
    } else {
      query.execute(`update users set name = '${name}' where id = ${id}`);
      res.send({ message: "updated" });
    }
  });
});
// delete user
app.delete("/delete", (req, res) => {
  let { id } = req.body;
  query.execute(`select * from users where id = ${id}`, (err, data) => {
    if (data.length == 0) {
      res.send({ message: "user dont exist " });
    } else {
      query.execute(`delete from users where id = ${id}`);
      res.send({ message: "deleted" });
    }
  });
});
// first search
app.post("/searchfora", (req, res) => {
  query.execute(
    `select * from users where name like 'a%' and age < 30`,
    (err, data) => {
      res.json(data);
    }
  );
});
// searchbyid
app.post("/searchById", (req, res) => {
  query.execute(`select * from users where id IN (1,2,3,4,5)`, (err, data) => {
    res.json(data);
  });
});
//get all users with products
app.get("/userProduct", (req, res) => {
  const { id } = req.body;
  query.execute(
    `select users.name,products.pName,products.pDescription,products.price from users join products on createdby = users.id where products.createdby = ${id} `,
    (err, data) => {
      if (data.length == 0) {
        res.send({ message: "user dont exist " });
      } else {
        res.json(data);
      }
    }
  );
});

// get all products
app.get("/getProducts", (req, res) => {
  query.execute(`select * from products`, (err, data) => {
    res.json(data);
  });
});
// add product
app.post("/addproduct", (req, res) => {
  let { pName, pDescription, price, createdby } = req.body;
  query.execute(
    `insert into products (pName,pDescription,price,createdby) values ('${pName}','${pDescription}','${price}','${createdby}')`,
    (err, data) => {
      if (err) {
        res.json(err);
      } else {
        res.send({ message: "added" });
      }
    }
  );
});
// delete product
app.delete("/deleteproductOwner", (req, res) => {
  let { id } = req.body;
  query.execute(`select * from products where id = ${id}`, (err, data) => {
    if (data.length == 0) {
      res.json({ message: "product dosent exist" });
    } else {
      // query.execute(`update products set createdby  = NULL`);
      res.send({ message: "user deleted", data });
    }
  });
});
// update product
app.put("/updateproductOwner", (req, res) => {
  let { userId, id } = req.body;
  query.execute(`select * from products where id = ${id}`, (err, data) => {
    if (data.length == 0) {
      res.json({ message: "product dosent exist" });
    } else {
      query.execute(`update products set createdby = ${userId}`);
      res.send({ message: "dddd" });
    }
  });
});
//   search product
app.post("/searchforproduct", (req, res) => {
  query.execute(`select * from products where price > 3000`, (err, data) => {
    res.json(data);
  });
});
//

app.listen(3000, () => {
  console.log("server is runnig");
});
