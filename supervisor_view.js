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
        choices: ["View Product Sales by Department", "Create New Department", "Quit"],
        name: "command"
    }]).then(function(choice) {
        switch (choice.command) {
            case "View Product Sales by Department":
                view_department_sales();
                break;
            case "Create New Department":
                create_new_department();
                break;
            case "Quit":
                process.exit(0);
        }
    });
}

var view_department_sales = () => {
    console.log(`id | department_name | overhead_costs | product_sales | total_profit`);
    connection.query("select * from departments", function(err, res) {
        for (var i = 0; i < res.length; i++) {
            var total_profit = res[i].total_sales - res[i].overhead_costs;
            console.log(`${res[i].department_id} | ${res[i].department_name} |  ${res[i].overhead_costs} | ${total_profit}`);
        }
    })
}

var create_new_department = () => {
    console.log("Creating new department.");
    inquirer.prompt([{
        type: "input",
        message: "Department id: ",
        name: "id"
    }, {
        type: "input",
        message: "Department name: ",
        name: "name"
    }, {
        type: "input",
        message: "Overhead costs: ",
        name: "overhead_costs"
    }]).then(function(department) {
        connection.query("insert into departments set ?", {
            department_id: department.id,
            department_name: department.name,
            overhead_costs: department.overhead_costs,
            total_sales: 0
        }, function(err,res){
            console.log("Department created.");
        });
    })


}
