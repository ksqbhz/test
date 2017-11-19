

class resultMsg {
    constructor(result_code, data, err_msg) {
        this.result_code = result_code;
        this.data = data;
        this.err_msg = err_msg;
    }
}
module.exports = resultMsg
