var db = require('./../config');
var mongodb=db.mongoose;
var Schema = mongodb.Schema;
var VoteDataSchema = new Schema({
    createID: Nmuber,
    statType: Number,
    statName: String,
    statDesc: String,
    selected: Number,
    IsSubmit: String,
    count: Number
},{versionKey:false});

VoteDataSchema.index({ createID: -1, IsSubmit: 1 });

var VoteDetailSchema = new Schema({
    eeid: String,
    createID: String,
    saveby: String,
    statType: Number,
    statName: String,
    statDesc: String,
    selected: Number,
    IsSubmit: String,
},{versionKey:false});

VoteDetailSchema.index({ saveby: 1, IsSubmit: 1 });

// 创建User的mongodb模型
exports.VoteNameDatamodel = mongodb.model ('votenamedata', VoteDataSchema);
exports.VoteNameDetailmodel = mongodb.model ('votenamedetail', VoteDetailSchema);

// module.exports = VoteNameDatamodel;
// module.exports = VoteNameDetailmodel;