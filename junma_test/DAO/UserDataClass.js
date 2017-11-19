let UserDataModel = require('./../model/userdata');

class UserDataClass {
    findByNameAndPwd(UserName, password, callback) {
        UserDataModel.findOne({
            UserName: UserName,
            password: password
        }, (err, result) => {
            if (err) {
                errLogger.error(err);
            }
            else {
                callback(result);
            }
        });
    }
}
