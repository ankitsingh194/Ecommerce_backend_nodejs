const mongoose = require('mongoose')
const validateMongoesId = (id => {
    const isValid = mongoose.Types.ObjectId(id);
    if(!isValid){
        res.send("This id is invalid");
    }
});

module.exports = {validateMongoesId}