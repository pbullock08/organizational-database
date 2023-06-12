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
                        name: 'View All Employees x Manager',
                        value: 'view_employees_by_manager'
                    },
                    {
                        name: 'View All Employees x Department',
                        value: 'view_employees_by_dept'
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
                        name: 'Update Employee Manager',
                        value: 'update_manager'
                    },
                    {
                        name: 'Delete Employee',
                        value: 'delete_employee'
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
                        name: 'Delete Role',
                        value: 'delete_role'
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
                case 'view_employees_by_manager':
                    viewEmployeesxManager();
                    break;
                case 'view_employees_by_dept':
                    viewEmployeesxDept();
                    break;
                case 'add_employee':
                    addEmployee();
                    break;
                case 'update_role':
                    updateRole();
                    break;
                case 'update_manager':
                    updateManager();
                    break;
                case 'delete_employee':
                    deleteEmployee();
                    break;
                case 'view_roles':
                    viewRoles();
                    break;
                case 'add_role':
                    addRole();
                    break;
                case 'delete_role':
                    deleteRole();
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

// view employees x manager
function viewEmployeesxManager() {
    db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(e.first_name," ", e.last_name) AS manager FROM employee JOIN role ON role.id = employee.role_id JOIN department ON department.id = role.department_id LEFT JOIN employee e on employee.manager_id = e.id ORDER BY manager', function (err, results) {
        console.table(results)
        showPrompts()
    })
};

// view employees x department
function viewEmployeesxDept() {
    db.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(e.first_name," ", e.last_name) AS manager FROM employee JOIN role ON role.id = employee.role_id JOIN department ON department.id = role.department_id LEFT JOIN employee e on employee.manager_id = e.id ORDER BY department', function (err, results) {
        console.table(results)
        showPrompts()
    })
};

// add employee
function addEmployee() {
    db.query('SELECT id, title FROM role', function (err, results) {
        const roleData = results.map((row) => ({
            name: row.title,
            value: row
        }))
        db.query('SELECT id, first_name,last_name FROM employee', function (err, results) {
            const managerData = results.map((row) => ({
                name: row.first_name + ' ' + row.last_name,
                value: row
            }))
            managerData.push({
                name: 'None',
                value: { id: null }
            })
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
                        message: 'What is the employees role?',
                        name: 'role_id',
                        choices: roleData
                    },
                    {
                        type: 'list',
                        message: 'Who is the employees manager?',
                        name: 'manager_id',
                        choices: managerData
                    },
                ])
                .then((e) => {
                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${e.employee_fn}', '${e.employee_ln}', '${e.role_id.id}', '${e.manager_id.id}')`, function (err, results) {
                        console.log(`${e.employee_fn} ${e.employee_ln} added to database.`);
                        showPrompts();
                    })
                })
        })
    })
};

// update employee role
function updateRole() {
    db.query('SELECT id, first_name, last_name FROM employee', function (err, results) {
        const employeeData = results.map((row) => ({
            name: row.first_name + ' ' + row.last_name,
            value: row
        }))
        db.query('SELECT id, title FROM role', function (err, results) {
            const updateRoleData = results.map((row) => ({
                name: row.title,
                value: row
            }))
            inquirer
                .prompt([
                    {
                        type: 'list',
                        message: 'Which employees role do you want to update?',
                        name: 'employee',
                        choices: employeeData
                    },
                    {
                        type: 'list',
                        message: 'What do you want to update their role to?',
                        name: 'new_role',
                        choices: updateRoleData
                    }
                ])
                .then((ur) => {
                    db.query(`UPDATE employee SET role_id = ${ur.new_role.id} WHERE id = ${ur.employee.id}`, function (err, results) {
                        console.log(`Updated ${ur.employee.first_name} ${ur.employee.last_name}'s role.`);
                        showPrompts();
                    })
                })
        })
    })
};

// update employee manager
function updateManager() {
    db.query('SELECT id, first_name, last_name FROM employee', function (err, results) {
        const employeeData = results.map((row) => ({
            name: row.first_name + ' ' + row.last_name,
            value: row
        }))
        db.query('SELECT id, first_name, last_name FROM employee', function (err, results) {
            const updateManagerData = results.map((row) => ({
                name: row.first_name + ' ' + row.last_name,
                value: row
            }))
            inquirer
                .prompt([
                    {
                        type: 'list',
                        message: 'Which employees manager do you want to update?',
                        name: 'employee',
                        choices: employeeData
                    },
                    {
                        type: 'list',
                        message: 'Who do you want to update their manager to?',
                        name: 'new_manager',
                        choices: updateManagerData
                    }
                ])
                .then((ur) => {
                    db.query(`UPDATE employee SET manager_id = ${ur.new_manager.id} WHERE id = ${ur.employee.id}`, function (err, results) {
                        console.log(`Updated ${ur.employee.first_name} ${ur.employee.last_name}'s manager.`);
                        showPrompts();
                    })
                })
        })
    })
};

// delete employee
function deleteEmployee() {
    db.query('SELECT id, first_name, last_name FROM employee', function (err, results) {
        const employeeData = results.map((row) => ({
            name: row.first_name + ' ' + row.last_name,
            value: row
        }))
        inquirer
            .prompt([
                {
                    type: 'list',
                    message: 'Which employee do you want to delete?',
                    name: 'employee',
                    choices: employeeData
                },
            ])
            .then((de) => {
                db.query(`DELETE FROM employee WHERE id = ${de.employee.id}`, function (err, results) {
                    console.log(`Deleted ${de.employee.first_name} ${de.employee.last_name} from database.`);
                    showPrompts();
                })
            })
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
    db.query('SELECT * FROM department;', function (err, results) {
        const deptData = results.map((row) => ({
            name: row.name,
            value: row
        }))
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
                    choices: deptData
                },
                {
                    type: 'input',
                    message: 'What is the salary of the role?',
                    name: 'salary'
                },
            ])
            .then((r) => {
                db.query(`INSERT INTO role (title, department_id, salary) VALUES ("${r.title}", '${r.dept_id.id}', '${r.salary}')`, function (err, results) {
                    console.log(`${r.title} added to database.`);
                    showPrompts();
                })
            })
    })

};

// delete role
function deleteRole() {
    db.query('SELECT id, title FROM role', function (err, results) {
        const roleData = results.map((row) => ({
            name: row.title,
            value: row
        }))
        inquirer
            .prompt([
                {
                    type: 'list',
                    message: 'Which role do you want to delete?',
                    name: 'role',
                    choices: roleData
                },
            ])
            .then((dr) => {
                console.log(dr)
                db.query(`DELETE FROM role WHERE id = ${dr.role.id}`, function (err, results) {
                    console.log(`Deleted ${dr.role.title} from database.`);
                    showPrompts();
                })
            })
    })
};

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
                console.log(`${d.name} added to database.`);
                showPrompts();
            })
        })
};

