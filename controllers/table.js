const { findAllStr} = require("../util/db");
exports.getTable = (req, res, next) => {
    findAllStr().then(result => {
        res.json(result)
    })
        .catch(err => console.log(err))
}

