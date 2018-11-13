var Validator = require('swagger-model-validator');
var swagger = new Validator();

process.argv.slice(2).forEach(function (i) {
    var js = require('../' + i);
    console.log("Validating: " + i);
    var validation = swagger.validate(i, js);
    console.log(JSON.stringify(validation, null, 2));
});
