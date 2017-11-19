var db = require('./../config');
var mongodb=db.mongoose;
var Schema = mongodb.Schema;

var querySchema = new Schema({
    keyword: String,
    resResult: String,
    expriesTime: Number,
},{versionKey:false});

querySchema.index({ keyword: 1});

queryDatatamodel = mongodb.model('queryData', querySchema);
// var silence = new queryDatatamodel({
//     keyword: 'Silence',
//     resResult: 'String',
//     expriesTime: 123,
// })
// silence.save(function(err,doc){
//     if(err){
//         console.log("error :" + err);
//     } else {
//         console.log(doc);
//     }
// });
module.exports = queryDatatamodel;

