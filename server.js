const express = require('express');
const hbs = require('hbs'); //after installing the handlebarjs package
const fs = require('fs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine','hbs'); // this tells express which engine we would like to use (in this case, handlebar engine)
app.use((req, res, next)=>{ // next is used to tell express when your middleware function is done
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err)=> {
    if(err) {
      console.log('Unable to append to server.log')
    }
  });
  next(); //if we don't use next, the page won't load because it will be stuck in this middleware
});

// app.use((req, res, next)=>{
//   res.render('maintenance.hbs');
//   // no need for next hear because we want it to stop
// });

app.use(express.static(__dirname+'/public')); //to use a middleware. __dirname is built-in variable that saves the path to the project directly so that we wouldn't have to enter the path from root
//middlewares are executed in the order they are on the file. If this was above the maintenance middleware, it will still display

hbs.registerHelper('getCurrentYear',()=>{
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt',(text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {
  //res.send('<h1>Hello Express!</h1>');
  // res.send({
  //   name: 'Andrew',
  //   likes: ['Biking',
  //   'Cities'
  //]

  res.render('home.hbs',{
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to my website',
  });
});

app.get('/about', (req, res)=>{
  //res.send('About Page'); // this is for single static page
  res.render('about.hbs', {
    pageTitle: 'About Page',
  }); // this is for static page rendering
});

app.get('/bad', (req, res) =>{
  res.send({
    errorMessage: 'Unable to handle request'
  });
});

app.listen(3000, ()=>{
  console.log('Server is up on port 3000');
}); //this is the port that will be used