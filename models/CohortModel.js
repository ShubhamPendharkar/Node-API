var mongoose= require('mongoose');
Schema=mongoose.Schema;

var CohortModel=new Schema({
    id:{type:Number,default:-1},
    name:{type:String}
});
module.exports=mongoose.model('Cohorts',CohortModel, 'Cohorts');