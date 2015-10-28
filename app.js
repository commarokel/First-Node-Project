var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var lusca = require('lusca');
var flash = require('express-flash');
var methodOverride = require('method-override');
var bcrypt = require('bcrypt-nodejs');

var passport = require('passport');
var expressValidator = require('express-validator');
var secrets = require('./config/secrets');

var routes = require('./routes/index');
var users = require('./routes/users');
var forms = require('./routes/user');
var questions = require('./routes/questions');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());
app.use(methodOverride());

// Question - How to use cookie in this case?
app.use(session({
  secret: secrets.sessionSecret,
  resave: true,
  saveUninitialized: true
  }));

var LocalStrategy = require('passport-local').Strategy;

// Load the user model
var Sequelize = require('sequelize');
var pghstore = require('pg-hstore');
var sequelize = new Sequelize('wine', 'superadmin', 'xxxxx', {
  host: '127.0.0.1',
  dialect: 'postgres',
  port: '5433',
  pool: {
      max:5,
      min:0,
      idle:10000
  },
});

var User = sequelize.import('./models/User');
User.sync();

var Question = sequelize.import('./models/Question');
Question.sync();

passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
},
function(req, email, password, done) {
  req.session.username = email;
  req.session.test = 'testing!';
  User.findOne({where: {username: email}})
      .then(function(user) {
        if(!user) {
          done(null, false, req.flash('loginMessage', 'Unknown User'));
        } 
        else if(!user.validPassword(password)) {
          done(null, false, req.flash('loginMessage', 'Wrong Password!'));
        }
        else {
          done(null, user);
        }
      })
      .catch(function(e) {
        done(null, false, req.flash('loginMessage', e.name + " " + e.message));
      });
}));

passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password', 
  passReqToCallback: true
},
function(req, email, password, done) {
  User.findOne({where: {username: email}})
      .then(function(exitingUser) {
        if(exitingUser)
          return done(null, false, req.flash('loginMessage', 'That email is already taken!'));

        if(req.user) {
          var user = req.user;
          user.username = email;
          req.session.username = email;
          user.password = User.generateHash(password);
          user.role = req.body.role;
          user.save().catch(function(err) {
            throw err;
          }).then(function() {
            done(null, user);
          });
        }
        else {
          var newUser = User.build({username: email, password: User.generateHash(password), role: req.body.role});
          req.session.username = email;
          newUser.save()
          .then(function() {
            done(null, newUser);
          })
          .catch(function(err) { 
            done(null,false,req.flash('loginMessage', err));
          });
        }
      })
      .catch(function(e) {
        done(null, false, req.flash('loginMessage', e.name + " " + e.message));
      })
}));

// Initialize Passport Session
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id).then(function(user) {
    done(null,user);
  }).catch(function(e) {
    done(e, false);
  });
  })

app.use(flash());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

app.use(function(err, req, res, next) {
  console.log(err);
});

// To verify that user is logged in 
function isLoggedIn(req, res, next) { 
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};
// To verify that admin is logged in 
function isAdminLoggedIn(req, res, next) {
  if(req.session.username === 'maxho@atomm.com.sg') {
    return next();
  }
  res.redirect('/');
};

// Routes for all pages below
app.get('/', routes.mainPage);
app.get('/users', users.userPage);
app.get('/signup', forms.getsignup);
app.post('/signup', passport.authenticate('local-signup', 
        {      
          successRedirect: '/profile',
          failureRedirect: '/signup',
          failureFlash: true 
        }
));
app.get('/login', forms.getLogin);
app.post('/login', passport.authenticate('local-login',
          {
            successRedirect:'/profile',
            failureRedirect: '/login',
            failureFlash: true
}));
app.get('/profile', isLoggedIn, routes.profilePage);
app.get('/admin', isAdminLoggedIn, routes.adminDashboard);
app.get('/questions-list', questions.getQuestion);
app.get('/submit-question', questions.getQuestionSubmission);
app.post('/submit-question', questions.postQuestion);
app.get('/question/:id', questions.getDetailedView);
app.post('/question/:id', questions.postAnswer);
app.post('/comment', questions.postComment);
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;
