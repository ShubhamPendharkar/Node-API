var mongoose= require('mongoose');
Schema=mongoose.Schema;

var PatientModel=new Schema({
    "PatientID":{type:String},
    "PatientGender":{type:String},
    "PatientDateOfBirth":{type:Date},
    "PatientRace":{type:String},
    "PatientMaritalStatus":{type:String},
    "PatientLanguage":{type:String},
    "PatientPopulationPercentageBelowPoverty":{type:Number},
    "FirstName":{type:String},
    "LastName":{type:String},
    "City":{type:String}
});
module.exports=mongoose.model('Patients',PatientModel, 'Patients');