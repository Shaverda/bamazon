const prompt = require("prompt");
const mysql = require("mysql");
const inquirer = require("inquirer");

//TODO: export mysql stuff so it's all dri

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "lolol",
    database: "amazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
})

connection.query("select * from products", function(err, res) {
    for (var i = 0; i < res.length; i++) {
        console.log(`${res[i].item_id}: ${res[i].product_name} @ $${res[i].price} each`);
    }
    purchase_items();
})
var purchase_items = () => {
    inquirer.prompt([{
        type: "input",
        message: "Enter the item # you'd like to purchase: ",
        name: "id"
    }, {
        type: "input",
        message: "Enter number of items: ",
        name: "quantity"
    }]).then(function(product) {
        connection.query("select * from products where item_id=?", [product.id], function(err, res) {
            if (product.quantity > res[0].stock_quantity) {
                console.log("Error. Insufficient Quantity. Purchase cancelled.");
            } else {
                var new_quantity = res[0].stock_quantity - product.quantity;
                update_database(product.id, new_quantity, res[0].price, product.quantity);
            };
        })
    })
}
var update_database = (id, new_quantity, price, quantity_purchased) => {
    connection.query("update products set ? where ?", [
            { stock_quantity: new_quantity },
            { item_id: id }
        ],
        function(err, res) {
            console.log("Purchase complete; database updated.");
            console.log(`'Grats. Your total is $${(price*quantity_purchased)}.`);
        })

}


//lol