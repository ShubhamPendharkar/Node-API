var express    = require('express'),
    app        = express(),
    mongoose   = require('mongoose'),
    bodyParser = require('body-parser'),
    Cohort     = require('./models/CohortModel'),
    Patient     = require('./models/PatientModel');

var port=process.env.PORT||3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
//var db=mongoose.connect('mongodb://localhost:27017/persistent',function(err){
var db=mongoose.connect('mongodb://shubhamkvsc:jc327404@ds037395.mongolab.com:37395/ionic',function(err){
    if(err)
        console.log(err);
    else
        console.log('Mongo Connected.');
});

app.get('/',function(req,res){
    res.send('Welcome');
});

var CohortRouter=express.Router();

CohortRouter.route ('/Filters')
    .post(function(req,res){
        var data={};

        //Filter format
        //Filter={
        //    "$and":[
        //        {
        //            "$where": "this.PatientDateOfBirth.toJSON().slice(0, 10) > '2000-09-14' "
        //        },
        //        {
        //            "$where": "this.PatientDateOfBirth.toJSON().slice(0, 10) <'2003-09-14'"
        //        },
        //        {
        //            "PatientGender":"Male"
        //        },
        //        {
        //          "City":"Mumbai"
        //        }
        //    ]
        //};

        //data={
        //    "MinAge":30,
        //    "MaxAge":40,
        //    "PatientGender":["Male"],
        //    "City":["Nirmal","Jhumri Tilaiya"]
        //}

        data=req.body;

        /*******************************AGE FILTER*******************************/
        var CurrentDate = new Date();
        var CurrentYear = CurrentDate.getFullYear();
        var MinAgeYear=CurrentYear-data.MinAge;
        var MaxAgeYear=CurrentYear-data.MaxAge;

        var ageString1='this.PatientDateOfBirth.toJSON().slice(0, 10) <\''+MinAgeYear+'-01-01'+'\'' ;
        var ageString2='this.PatientDateOfBirth.toJSON().slice(0, 10) >\''+MaxAgeYear+'-01-01'+'\'' ;
        /*******************************AGE FILTER*******************************/


        /*******************************Gender FILTER*******************************/
        var i;
        var GenderLength = data.PatientGender.length;
        var GenderString="";
        for (i = 0; i < GenderLength-1; i++) {
            GenderString=GenderString+'{ "PatientGender" :"'+data.PatientGender[i]+'"},';
        }
        GenderString=GenderString+'{ "PatientGender" :"'+data.PatientGender[i]+'"}';
        var GenderStringJSON=JSON.parse('['+GenderString+']');
        /*******************************Gender FILTER*******************************/

        

        /*******************************Cities FILTER*******************************/
        var CityLength = data.City.length;
        var CityString="";
        for (i = 0; i < CityLength-1; i++) {
            CityString=CityString+'{ "City" :"'+data.City[i]+'"},';
        }
        CityString=CityString+'{ "City" :"'+data.City[i]+'"}';
        var CityStringJSON=JSON.parse('['+CityString+']');
        /*******************************Cities FILTER*******************************/



        var Filter={
            "$and":[
                {
                    "$where": ageString1
                },
                {
                    "$where": ageString2
                },
                {
                    "$or":GenderStringJSON
                }//,
                //{
                //    "$or":CityStringJSON
                //}
            ]
        };
        Patient.find(Filter,function (err,patients) {
            if(err)
                res.status(500).send(err);
            else
                res.json(patients);
        });
    })

    .get(function(req,res){
        var query=req.query;
        Patient.find(query,function (err,patients) {
            if(err)
                res.status(500).send(err);
            else
                res.json(patients);
        });
    });


CohortRouter.route ('/Cohorts')
    .post(function(req,res){
        var cohort=new Cohort(req.body);
        cohort.save();                        // saving to the DB
        res.status(201).send(cohort);         // status 201 means successfully record created
    })

    .get(function(req,res){
        var query=req.query;
        Cohort.find(query,function (err,cohorts) {
            if(err)
                res.status(500).send(err);
            else
                res.json(cohorts);
        });
    });

CohortRouter.use('/Cohorts/:id',function(req,res,next) {
    Cohort.findById(req.params.id,function (err,cohort) {
        if(err)
            res.status(500).send(err);
        else if(cohort){
            req.cohort=cohort;
            next();
        }
        else
        {
            res.status(404).send('Cohort not found....!!');
        }
    });
});

CohortRouter.route('/Cohorts/:id')
    .get(function(req,res){
        res.json(req.cohort);
    })
    .put(function(req,res){
        req.cohort.id=req.body.id;
        req.cohort.name=req.body.name;
        req.cohort.save(function (err) {          //callback
            if(err)
                res.status(500).send(err);
            else
                res.json(req.cohort);
        });

    })
    .patch(function(req,res){
        if(req.body._id)
            delete req.body._id;

        for(var p in req.body)
        {
            req.cohort[p]=req.body[p];
        }
        res.json(req.cohort);
    })
    .delete(function (req,res) {
        req.cohort.remove(function(err){
            if(err)
                res.status(500).send(err);
            else
                res.status(204).send('Cohort removed');
        });
    });


app.use('/api',CohortRouter);
app.listen(port, function () {
    console.log('Listening on port no. '+ port);
});
