/**
 * Created by Shubham Pendharkar on 3/31/2016.
 */

var mongoose= require('mongoose');
Schema=mongoose.Schema;

var DiseaseModel=new Schema({
    "PatientID":{type:String},
    "AdmissionID":{type:Number},
    "PrimaryDiagnosisCode":{type:String},
    "PrimaryDiagnosisDescription":{type:String}
});
module.exports=mongoose.model('Diseases',DiseaseModel, 'Diseases');
