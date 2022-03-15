const mysql = require('mysql2')

const db = mysql.createConnection('mysql://root:rootroot@localhost:3306/employeeManager02_db')

const inquirer = require('inquirer')


  // * Add departments, roles, employees

  // * View departments, roles, employees

  // * Update employee roles

  const question = () => {
  inquirer.prompt([{
    message: 'What would you like to do?',
    type: 'list',
    choices: ['Add Department', 'Add Role', 'Add Employee', 'View Departments', 'View Roles','View Employees', 'Update Employee Role', 'Nothing'],
    name: 'choice'
  }])
  .then(init=> {
    // console.log(init)
    // console.log(init.choice)
    switch(init.choice) {
      case 'Add Department': 
      addDepartment()
      break
      case 'Add Role': 
      addRole()
      break
      case 'Add Employee': 
      addEmployee()
      break
      case 'View Departments':
      viewDepartments()
      break
      case 'View Roles': 
      viewRoles()
      break
      case 'View Employees':
      viewEmployees()
      break
      case 'Update Employee Role':
      updateRole()
      break
      case 'Nothing':
      console.log('have a nice day!')
      break
    }
  })
}

  const addDepartment = () => {
    console.log('you tried to add a department!')
    inquirer.prompt([{
      message: 'what is the name of the department you would like to add?',
      type: 'input',
      name: 'name'
    }])
    .then(department => {
      // console.log(department)
      db.query('INSERT INTO departments SET ?', department, err=> {
        if(err) {console.log(err)}
      })
      console.log('department added!')
      question()
    })
  }

  const addRole = () => {
    console.log('you tried to add a department!')
    inquirer.prompt([{
      message: 'what is the title of the role you would like to add?',
      type: 'input',
      name: 'title'
    },
    {
      message: 'what is the salary of the role you would like to add?',
      type: 'input',
      name: 'salary'
    },
    {
      message: 'what is the id of the department of the role?',
      type: 'input',
      name: 'department_id'
    }
  ])
    .then(role => {
      console.log(role)
      db.query('INSERT INTO roles SET ?', role, err=> {
        if(err) {console.log(err)}
      })
      console.log('role added!')
      question()
    })
  }

  const addEmployee = () => {
    
    inquirer.prompt([{
      message: 'what is the first name of the employee you would like to add?',
      type: 'input',
      name: 'first_name'
    },
    {
      message: 'what is the last name of the employee you would like to add?',
      type: 'input',
      name: 'last_name'
    },
    {
      message: 'what is the role id of the employee?',
      type: 'input',
      name: 'role_id'
    },
    {
      message: 'is the employee a manager?',
      type: 'list',
      choices: ['yes', 'no'],
      name: 'managerBoolean'
    }
  ])
    .then(employee => {
      console.log(employee)
      if(employee.managerBoolean === 'yes') {
        console.log('you tried to add a manager!')
        delete employee.managerBoolean 
        console.log(employee)
        db.query('INSERT INTO employees SET ?', employee, err=> {
        if(err) {console.log(err)}
      })
      console.log('employee added!')
      question()


      } else if (employee.managerBoolean === 'no') {
        // console.log('you tried to add a subordinate')
        inquirer.prompt([{
          message: 'what is the id of the manager of the employee?',
          type: 'input',
          name: 'manager_id'
        }])
        .then(subordinate => {
          console.log(employee)
          console.log(subordinate)

          delete employee.managerBoolean

          let newEmployee = {
            ...employee,
            ...subordinate
          }
          db.query('INSERT INTO employees SET ?', newEmployee, err=> {
        if(err) {console.log(err)}
      })
      console.log('employee added!')
      question()

        })
      }
    })
  }

  const updateRole = () => {
    inquirer.prompt([{
      message: 'what is the id of the employee you would like to update?',
      type: 'input',
      name: 'id'
    },
    {
      message: 'what is the id of the role that the employee should be updated to?',
      type: 'input',
      name: 'role_id'
    }])
    .then(employee => {
     
      let newRole = {
        role_id: employee.role_id
      }
     db.query(`UPDATE employees SET ? WHERE id = ${employee.id}`, newRole, err=> {
        if(err) {console.log(err)}
      })
      console.log('employee updated!')
      question()
    })
  }

  const viewDepartments = () => {
    db.query('SELECT * FROM departments', (err, departments) => {
      // if(err) {
      //   console.log(err)
      // }
      console.table(departments)
    })
    question()
  }

  const viewRoles = () => {
    db.query('SELECT * FROM roles', (err, roles) => {
      // if(err) {
      //   console.log(err)
      // }
      console.table(roles)
    })
    question()
  }

   const viewEmployees = () => {
    db.query('SELECT * FROM employees', (err, employees) => {
      // if(err) {
      //   console.log(err)
      // }
      console.table(employees)
    })
    question()
  }

  

  

  question()