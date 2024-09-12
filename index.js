const express = require('express');
const app =  express();
const hbs = require('hbs');
const nocache = require('nocache');
const session = require('express-session');
app.use(express.static('public'));
app.set('view engine','hbs');
const username = "admin"
const password = "admin@123"
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,

}))

app.use(nocache())

app.get('/',(req,res) =>{

  if(req.session.user){

    res.render('home')
  }else
  {
    if(req.session.passwordwrong){

      res.render('login',{msg:"in correct"})
      req.session.passwordwrong=false
    }else
    {
      res.render('login')
    }
   
  }
  
})

app.post('/verify', (req, res) => {
  console.log(req.body);
 

  if (req.body.username === username && req.body.password === password) {
      req.session.user = req.body.username;
      res.redirect('/home');
  } else {
      req.session.passwordwrong = true;
      req.session.errorMessage = "in correct username or password"; 
      res.redirect('/');
  }
});

app.get('/home',(req,res)=>{

  if(req.session.user){
    res.render('home')
  }else
  {
    if(req.session.passwordwrong){
      req.session.passwordwrong=false
      res.render('login',{msg:"in correct"})
    }else
    {
      res.render('login')
    }
    
  }
});

app.get('/', (req, res) => {
  if (req.session.user) {
      res.render('home');
  } else {
      let message = req.session.errorMessage || null;
      req.session.errorMessage = null; 
      res.render('login', { msg: message });
  }
});

app.get('/logout',(req,res)=>{  
  req.session.destroy()

  res.render('login');
});


app.listen(3000, () => console.log('server running on port 3000'));