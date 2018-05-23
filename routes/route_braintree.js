var braintree = require("braintree");

var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: "gn68h5xvwfzrpb5n",
    publicKey: "mvgq5rnf54dnbfgs",
    privateKey: "dc88f545bfd447d12c69a357ba161a16"
});

gateway.clientToken.generate({
    customerId: "hello"
}, function (err, response) {
    var clientToken = response.clientToken
});

module.exports = function(router) {
    router.route('/client_token').get(function (req, res) {
        gateway.clientToken.generate({}, function (err, response) {
            res.send(response.clientToken);
        });
    });
};