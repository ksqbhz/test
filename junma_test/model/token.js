var db = require('./../config');
var mongodb=db.mongoose;
var Schema = mongodb.Schema;
var tokenSchema = new Schema({
    user: String,
    token: String,
    dateTime: Number,
    isApp: Boolean
}, {versionKey: false});

tokenSchema.index({ token: 1});
// 创建User的mongodb模型
var tokenListmodel = mongodb.model ('tokenlists', tokenSchema);

module.exports = tokenListmodel;