//expressjs.com for documentation

const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

//use by heroku
//process.env object the stored all environment variables
// || tells that if not PORT use 3000.
const port = process.env.PORT || 3000;
//new express app
var app = express();

//support for partials.
hbs.registerPartials(__dirname + '/views/partials');
//views is the defayult directory express uses for templates
//set app to use the hbs module
//it runs by the order you coded them,
//so to make the public folder not see-able, put it after the maintenance.hbs
app.set('view engine', 'hbs');
//express middleware, configure how express app works.
//this is how use register a middleware. it takes a function
app.use((req, res, next) => {
  //next argument exists so you can tell the middleware function is done.
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if(err) {
      console.log('Unable to append to server.log');
    }
  });
  next();
});

//to put maintenance page.
// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
// });

app.use(express.static(__dirname + '/public'));

//instead of putting it in the render function you can do this.
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});
//register handler
//1st agrument root of the app that's why it is forward slash.
//2nd function contains 2 arguments: request and response
//root route
app.get('/', (req, res) => {
  //response on the HTTP request
  //response.send passing an object express notices it
  //and takes it and converts it into JSON and sends back to browser
  // res.send('<h1>Hello Express!</h1>');
  // res.send({
  //   name: 'Philip',
  //   likes: [
  //     'Hiking',
  //     'Biking',
  //     'Swimming',
  //     'Eating'
  //   ]
  // })
  res.render('home.hbs', {
    pageTitle: 'My Website',
    // currentYear: new Date().getFullYear(),
    welcomeMessage: 'Welcome to my site!'
  })
});

//about page
//about route
app.get('/about', (req, res) => {
  // res.send('About Me Page');
  //makes you render the setup in your current view
  res.render('about.hbs', {
    pageTitle: 'About Page'
    // currentYear: new Date().getFullYear() -> we are using now the hbs.registerHelper.
  });
});

// create route on /bad - send back JSON with errorMessage property
app.get('/bad', (req, res) => {
  res.send({
    errorCode: 'Bad',
    errorMessage: 'Unable to process request'
  });
});

//make app listen. bind an application to a port in our machine
//common port number for developing locally
//2nd argument (optional) function
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
