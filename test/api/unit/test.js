var expect = require('chai').expect;
var request = require("request");

var path = {
    local : 'http://localhost:3003/',
    production : 'http://localhost:3003/'
};

var apiPath = path.local + 'api/';


describe('Test Case', function () {
    it('should respond equal 1', function () {
        expect(1).to.equal(1);
    })
});





describe("API Get Dish List Data", function() {

    var url = apiPath + "dishes";

    it("returns status 200", function(done) {
        request(url, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            expect(body.length).to.be.above(0);
            done();
        });
    });

    it("returns dish data length > 2", function(done) {
        request(url, function(error, response, body) {
            expect(body.length).to.be.above(2);
            done();
        });
    });

});





describe("API Login", function() {

    var url = apiPath + "user/token";
    var postdata = {
        "grant_type": "password",
        "username": "13564568304",
        "password": "xwcook789",
        "deviceToken": "0a8b9e7cbe68616cd5470e4c8abb4c1a3f4ba2bee4ca113ff02ae2c325948b8a",
        "couponcode": "XWSALES003"
    };

    it("returns status 200", function(done) {

        request.post({url:url, form: postdata}, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });


    it("returns access_token should be string", function(done) {

        request.post({url:url, form: postdata}, function(error, response, body) {
            var result = JSON.parse(body);
            expect(result.access_token).to.be.a('string');
            expect(result.access_token.length).to.above(10);
            done();
        });
    });



});




describe("API Submit New Order", function() {

    var url = apiPath + "user/token";

    var token = null;

    var postdata = {
        "grant_type": "password",
        "username": "13564568304",
        "password": "xwcook789",
        "deviceToken": "0a8b9e7cbe68616cd5470e4c8abb4c1a3f4ba2bee4ca113ff02ae2c325948b8a",
        "couponcode": "XWSALES003"
    };


    before(function(done) {
        request(url)
            .post('/user/token')
            .send({ _id: user1._id, password: user1.password })
            .end(function(err, res) {
                token = res.body.token; // Or something
                done();
            });
    });

    it("returns status 200", function(done) {

        request.post({url:url, form: postdata}, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });


    it("returns access_token should be string", function(done) {

        request.post({url:url, form: postdata}, function(error, response, body) {
            var result = JSON.parse(body);
            expect(result.access_token).to.be.a('string');
            expect(result.access_token.length).to.above(10);
            done();
        });
    });



});






it('should get a valid token for user: user1', function(done) {
    request('/get/user')
        .set('Authorization', token)
        .expect(200, done);
});
