// import mysql
const mysql = require('mysql2');

// import inquirer
const inquirer = require('inquirer');

// import tabel 
const table = require('table');

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
        console.log(selection.choice);
    });
