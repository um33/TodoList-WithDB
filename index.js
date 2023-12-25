import express from "express";
import bodyParser from "body-parser";
import pg from "pg"

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "Umar123%",
  port: 5432,
});
db.connect();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];

app.get("/", async(req, res) => {
  try{
 const getItems = await db.query("SElECT * FROM items")
 items = getItems.rows
 console.log(items.rows)
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });

} catch(error){
  console.error("Error retrieving items",error);
  res.status(500).send("Error retrieving items");
}
});

app.post("/add", async(req, res) => {
  try{
  const item = req.body.newItem;
  const addItem = await db.query("insert into items (title) values ($1)", [item]).rows
  console.log(addItem)
  items.push(addItem);
  res.redirect("/")
    }catch(error){
      console.error("Error retrieving items",error);
      res.status(500).send("Error retrieving items");
  }
})

app.post("/edit", async(req, res) => {
  const id = req.body.updatedItemId
  const title =  req.body.updatedItemTitle
  console.log(title)
  await db.query("UPDATE items SET title = ($1) WHERE id = $2 RETURNING *", [title, id])
  res.redirect("/")
});

app.post("/delete", async(req, res) => {
  try{
  const id = req.body.deleteItemId
  await db.query(await db.query("DELETE FROM items WHERE id = $1 RETURNING *", [id]))
  items.pop(id)
  res.redirect("/")
} catch (error) {
  console.log(error);
}
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
