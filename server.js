//Dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

//connection
const connection = mysql.createConnection({

  host: "localhost",
  port: 3301,
  user: "root",
  password: "password10",
  database: "employee_tracker"
});

connection.connect((err) => {
  if (err) throw err;

  runSearch()
});

//code
function runSEarch() {
  inquirer.prompt({
    name: "selection",
    type: "list",
    message: "What would you like to do?",
    choices: [
      "View all employees",
      "View department",
      "View role",
      "Add employee",
      "Add department",
      "Add role",
      "Update role",
    
    ]
  })
  .then(function(answer) {
    console.log(answer);

    if (answer.selection === "View all employees") {
      viewAll();
    } else if(answer.selection === "View Department") {
      viewDept();
    } else if(answer.selection === "View role") {
      viewRole();
    } else if(answer.selection === "Add employee") {
      addEmployee()
    } else if (answer.selection === "Add department") {
      addDept();
    } else if(answer.selection === "Add role") {
      addRole();
    } else if(answer.selection === "Update role") {
      updateRole();
    } else {
      connection.end();
    }
  });
}

//View all employees functions
function viewAll() {
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, employee.role_id, employee.manager_id, role.title, role.salary, role.id, department.id FROM employee LEFT JOIN role ON employee.role_id LEFT JOIN department ON role.department_id = department.id",
    function(err, result, fields) {
      if (err) throw err;
      console.table(result);

    runSearch();
    }
  );
};

function viewrole() {
  connection.query(
    "SELECT role.id, role.title, role.salary, role.department_id, department.id, department.name FROM role LEFT JOIN department on role.department_id = department.id",
    function(err, result, fields) {
      if (err) throw err;
      console.table(result);

      runSearch();
    }
  );
};

function viewDepts() {
  connection.query("SELECT * FROM department,", function(err, results, fields) {
    if (err) throw err;
    console.table(result);
    runSearch();
  }
  );
};

const roleChoices = [];
const empChoices = [];
const deptChoices = [];

function lookuprole(){

  connection.query("SELECT * FROM role", function (err, data) {
    if (err) throw err;
    for (i = 0; i < data.length; i++) {
      roleChoices.push(data[i] + "-" + data[i].title)
    }
  })
}

function lookupEmployee(){
  connection.query("SELECT * FROM employee", function (err, data) {
    if (err) throw err;
    for (i = 0; i < data.length; i++) {
      empChoices.push(data[i].id + "-" + data[i].first_name+" "+ data[i].last_name)
    }
  })
}

function lookupDepts(){
  connection.query("SELECT * FROM department", function (err, data) {
    if (err) throw err;
    for (i = 0; i < data.length; i++) {
      deptChoices.push(data[i].id + "-" + data[i].name)
    }
  })
}

function addEmployee9) {

  lookuprole()
  lookupEmployee()

  inquirer.prompt([
    {
      name: "firstname",
      type: "input",
      message: "What is the employee's first name?",
    },
    {
      name: "lastname",
      type: "input",
      message: "What is the employee's last name?",
    },
    {
      name: "role",
      type: "input",
      message: "What is the employee's role?",
      choices: roleChoices
    },
    {
      name: "reportingTo",
      type: "list",
      message: "Who is the employee's manager?",
      choices: empChoices
    },
  ]).then(function(answer) {
    const getRoleId = answer.role.split("-")
    const getReportingToId = answer.reportingTo.split("-")
    const query=
    `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES ('${answer.firstname}', '${answer.lastname}', '${getRoleId[0]}', '${getReportingToId[0]}')'`;
    connection.query(query, function(err, res) {
      console.log(`new employee ${answer.firstname} ${answer.lastname} added.`)
    });
    runSearch();
  });
};

function addRole() {

  lookuprole()
  lookupEmployee()
  lookupDepts()

  inquirer.prompt([
    {
      name: "role",
      type: "input",
      message: "Enter the role you would like to add:"
    },
    {
      name: "dept",
      type: "list",
      message: "Which department do you want to add this role to?",
      choices: deptChoices
    },
    {
      name: "salary",
      type: "number",
      message: "Enter the role's salary."
    },
  ]).then(function(answer) {
    console.log(`${answer.role}`)
    const getDeptId = answer.dept.split('-')
    const query = 
    `INSERT INTO role (title, salary, department_id)
    VALUES ('${answer.role}', '${answer.salary}', '${getDeptId[0]}')`;
  })
}