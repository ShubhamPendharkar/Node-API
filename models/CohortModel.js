var mongoose= require('mongoose');
Schema=mongoose.Schema;

var CohortModel=new Schema({
    Name:{type:String},
    Filters:{
        "MinAge":{type:Number},
        "MaxAge":{type:Number},
        "PatientGender":[{type:String}],
        "City":[{type:String}]
    },
    Patients:[{
        "PatientID":{type:String},
        "FirstName":{type:String},
        "LastName":{type:String}
    }],
    PatientsCount:{type:Number}
});
module.exports=mongoose.model('Cohorts',CohortModel, 'Cohorts');