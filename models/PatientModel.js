var mongoose= require('mongoose');
Schema=mongoose.Schema;

var PatientModel=new Schema({
    "resourceType":{type:String},
    "id":{type:Number},
    "gender":{type:String},
    "birthDate":{type:String},
    "address":[
        {
            "city":String,
            "state":String,
            "postalCode":Number,
            "country":String
        }
    ]
});
module.exports=mongoose.model('Patients',PatientModel, 'Patients');