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
    init_menu();
})

var init_menu = () => {
    inquirer.prompt([{
        type: "list",
        message: "Welcome. Select an option. ",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"],
        name: "command"
    }]).then(function(choice) {
        switch (choice.command) {
            case "View Products for Sale":
            	var flag = true;
                view_products(flag);
                break;
            case "View Low Inventory":
                view_low_inventory();
                break;
            case "Add to Inventory":
                add_to_inventory();
                break;
            case "Add New Product":
                add_new_product();
                break;
            case "Quit":
                process.exit(0);
        }
    });
}

var view_products = (flag) => {
    connection.query("select * from products", function(err, res) {
        if (err) throw err;
        console.log(`\nID | Item Name | Item Price | Stock Quantity`);
        for (var i = 0; i < res.length; i++) {
            console.log(` ${res[i].item_id} | ${res[i].product_name} | ${res[i].price} | ${res[i].stock_quantity}`);
        }
        console.log("\n");
        if (flag){
        	init_menu();
        }
    })
}

var view_low_inventory = () => {
    connection.query("select * from products where stock_quantity<?", [5], function(err, res) {
        console.log("Showing items with less than 5 in stock.");
        console.log(`ID | Item Name | Stock Quantity`)
        for (var i = 0; i < res.length; i++) {
            console.log(`${res[i].item_id} | ${res[i].product_name} | ${res[i].stock_quantity}`);
        }
        console.log("\n");
        init_menu();
    })
}

var add_to_inventory = () => {
	var flag = false;
    view_products(flag);
    inquirer.prompt([{
        type: "input",
        message: "Choose the id of an item to add more stock. ",
        name: "item_id"
    }, {
        type: "input",
        message: "How many more to add to stock?",
        name: "quantity"
    }]).then(function(item) {
        connection.query("select * from products where item_id=?", [item.item_id], function(err, res) {
            var new_quantity = parseInt((res[0].stock_quantity)) + parseInt((item.quantity));
            connection.query("update products set ? where ?", [
                { stock_quantity: new_quantity },
                { item_id: item.item_id }
            ]);
            console.log("Items updated.\n");
            init_menu();
        });
    })
}

var add_new_product = () => {
	inquirer.prompt([{
        type: "input",
        message: "Item name: ",
        name: "name"
    }, {
        type: "input",
        message: "Department name: ",
        name: "department"
    }, {
    	type: "input",
    	message: "Price: ",
    	name: "price"
    }, {
    	type: "input",
    	message: "Number in stock:",
    	name: "stock_quantity"
    }]).then(function(item){
    	connection.query("insert into products set?", {
    		product_name: item.name,
    		department_name: item.department,
    		price: item.price,
    		stock_quantity: item.stock_quantity
    	}, function(err, res){
    		console.log("Item added to inventory.\n");
    		init_menu();
    	})
    })
}
