var request = require('request')
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var conf = require('./config.json');
var router = express.Router();
var pkg = require('./package.json');
var mongoose = require('mongoose')
var models = require('./models.js');
var seeder = require('./seeder.js')

var db = mongoose.connection;
var Schema = mongoose.Schema;

mongoose.connect( conf.db, { useNewUrlParser: true, useCreateIndex: true }).then(function () {
     console.log('Mongodb connect success!')
 }, function (err) {
     console.log('Mongodb connect error: ', err)
 })

var AccountModel = mongoose.model( "Account", models.Account( Schema ) );

var JobModel = mongoose.model( "Job", models.Job( Schema ) );

var LoginModel = mongoose.model( "Login", models.Login( Schema ) );

/*var acc = new AccountModel( seeder.getBaseAccount() );

acc.save();

var login = new LoginModel( seeder.getBaseLogin() );

login.save(); */

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var data = {  name: pkg.name, version: pkg.version, description: pkg.description }

app.use( express.json() );

app.use( '/public', express.static( 'public' ));

app.set("view engine", "pug");


app.get('/', function (req, res) {

   data.title = "Login";

   res.render('index', data )

})

app.get('/home', function (req, res) {

     data.title = "Home";

     res.render('home', data )

})

app.get('/proxy/:url', function (req, res) {

     var url = 'http://' + req.params.url;

     request( url ).pipe( res )

})

app.post('/api/job', async function (req, res) {

     var obj = {
          bm: req.body.bm,
          type: req.body.type,
          account: 1
     };

     
     if ( req.body.hasOwnProperty( 'un' ) ) 
          obj.un = req.body.un;
     else
          obj.un = await models.getDefaultUn( LoginModel, obj );


     if ( req.body.hasOwnProperty( 'pw' ) ) 
          obj.pw = req.body.pw;
     else
          obj.pw = await models.getDefaultPw( LoginModel, obj );


     var job = new JobModel( obj );
     await job.save();
     res.status( 200 ).end();

});

app.get('/api/job/get', function (req, res) {


     var id = req.query.accountId;

     JobModel.findOne({ }).lean().
          then( job => res.status( 200 ).json({ job })).
          catch(error => res.status( 500 ).json({ error: error.message }));
});

app.get('/api/job/start', function (req, res) {

     
     var id = req.query.jobId;
     
     var date = new Date();

     JobModel.findByIdAndUpdate( id, { started_at: date })
          .then( job => res.status( 200 ).end() )
          .catch( error => res.status( 500 ).end() );
});


var server = app.listen(conf.port, conf.host, function () {
     console.log("Listening at http://%s:%s", conf.host, conf.port)
})