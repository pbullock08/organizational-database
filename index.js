// import mysql
const mysql = require('mysql2');

// import inquirer
const inquirer = require('inquirer');

// import console.table
const cTable = require('console.table');

// import figlet for banner
const figlet = require('figlet');

// connect to database 
const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: 'rootroot',
        database: 'organization_db'
    },
    console.log(`Connected to the organization_db database.`)
)

//show banner
figlet("Employee Manager", function (err, data) {
    if (err) {
        console.log("Something went wrong...");
        console.dir(err);
        return;
    }
    console.log(data);
    showPrompts();
});

// function to get user input on what they'd like to do
function showPrompts() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to do?',
                name: 'choice',
                choices: [
                    {
                        name: 'View All Employees',
                        value: 'view_employees'
                    },
                    {
                        name: 'Add Employee',
                        value: 'add_employee'
                    },
                    {
                        name: 'Update Employee Role',
                        value: 'update_role'
                    },
                    {
                        name: 'View All Roles',
                        value: 'view_roles'
                    },
                    {
                        name: 'Add Role',
                        value: 'add_role'
                    },
                    {
                        name: 'View Departments',
                        value: 'view_departments'
                    },
                    {
                        name: 'Add Department',
                        value: 'add_department'
                    },
                    {
                        name: 'Quit',
                        value: 'quit'
                    },
                ]
            }
        ])
        .then((selection) => {
            // console.log(selection.choice);
            switch (selection.choice) {
                case 'view_employees':
                    viewEmployees();
                    break;
                case 'add_employee':
                    addEmployee();
                    break;
                case 'view_roles':
                    viewRoles();
                    break;
                case 'add_role':
                    addRole();
                    break;
                case 'view_departments':
                    viewDepartments();
                    break;
                case 'add_department':
                    addDepartment();
                    break;
                default:
                    process.exit();
                    break;
            }
        });
};

// view employees 
function viewEmployees() {
    db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(e.first_name," ", e.last_name) AS manager FROM employee JOIN role ON role.id = employee.role_id JOIN department ON department.id = role.department_id LEFT JOIN employee e on employee.manager_id = e.id;', function (err, results) {
        console.table(results)
        showPrompts()
    })
};

// add employee
function addEmployee() {

    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the employees first name?',
                name: 'employee_fn'
            },
            {
                type: 'input',
                message: 'What is the employees last name?',
                name: 'employee_ln'
            },
            {
                type: 'list',
                message: 'What is the employees role id?',
                name: 'employee_role',
                choices: [1, 2, 3, 4, 5, 6, 7, 8]
            },
            {
                type: 'list',
                message: 'What is their managers id?',
                name: 'employee_mgr',
                choices: [1, 2, 3, 4, 5, 6, 7, 8]
            },
        ])
        .then((e) => {
            if (e.employee_mgr === 'None') {
                db.query('INSERT INTO employee (first_name, last_name, ) ')
            }
            console.log(e);
        })
};

// view roles
function viewRoles() {
    db.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON department.id = role.department_id;', function (err, results) {
        console.table(results)
        showPrompts()
    })
};


// add role
function addRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the title of the role?',
                name: 'title'
            },
            {
                type: 'list',
                message: 'What is the department related to the role?',
                name: 'dept_id',
                choices: []
            },
            {
                type: 'input',
                message: 'What is the salary of the role?',
                name: 'salary'
            },
        ])
        .then((r) => {
            switch(r.dept_id) {

            }
            // db.query(`INSERT INTO role (title, department_id, salary) VALUES ("${r.title}", '${r.dept_id}', '${r.salary}')`, function (err, results) {
            // })
        })
        .then((results) => {
            // db.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role JOIN department ON department.id = role.department_id;', function (err, results) {
            //     console.table(results)
            // })
        })
}

// view all departments
function viewDepartments() {
    db.query('SELECT * FROM department;', function (err, results) {
        console.table(results)
        showPrompts()
    })
};

// add department
function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the name of the department?',
                name: 'name'
            }
        ])
        .then((d) => {
            db.query(`INSERT INTO department (name) VALUES ("${d.name}")`, function (err, results) {
            })
            console.log(`${d.name} added to database.`);
            showPrompts();
        })
};

