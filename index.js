const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

const PORT = 5000 || process.env.PORT;

// middlewares
app.use(cors());
app.use(express.json()); // req.body
app.use(express.urlencoded({ extended: true })); // req.query
// templating engine
app.set('view engine', 'ejs');

// login the user
app.post('/Users/signin', (req, res) => {
  const { email, password } = req.body;
  // console.log(`${email} ${password} `)
  
  pool.query(
    'SELECT * FROM Users WHERE email = $1',
    [email],
    (err, results) => {
      if (err) {
        throw err;
      }
      if (results.rowCount > 0) {
        if (results.rows[0].password === password) {
          res.json({
            message: 'Login successful',
            user: results.rows[0],
            statusCode: 200
          });
        } else {
          res.json({
            message: 'Incorrect password',
            statusCode:401

          });
        }
      } else {
        res.json({
          message: 'User not found',
          statusCode:404
        });
      }
    }
  );
});

// register the user
app.post('/Users/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ message: `Please enter all the fields` });
    // res.json({ message: `Please enter all the fields ${name} ${email} ${password}` });
  }

  pool.query('SELECT * FROM users WHERE email = $1', [email], (err, result) => {
    if (err) {
      res.status(404).json({message:`ERROR OCCURED`})
      throw err;
    }

    console.log(result.rows[0])
    if (result.rows[0] == undefined) {
      pool.query(
        'INSERT INTO Users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
        [name, email, password],
        (err, result) => {
          if (err) {
            throw err;
          }
          console.log('User Successfully Registered!', result.rows[0]);
          return res.json({ message: 'User Successfully Registered!' });
        }
      );
    } else {
      console.log('User already exists!');
      res.json({ message: 'User Already Exists!' });
    }
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});