var expect = require('chai').expect;
var request = require("request");

var path = {
    local : 'http://localhost:3003/',
    production : 'http://localhost:3003/'
};

var apiPath = path.local + 'api/';

var postUserData = {
    "grant_type": "password",
    "username": "18621870070", //汤圣罡
    "password": "xwcook789",
    "deviceToken": "0a8b9e7cbe68616cd5470e4c8abb4c1a3f4ba2bee4ca113ff02ae2c325948b8a",
    "couponcode": "XWSALES003"
};




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

    it("returns status 200", function(done) {

        request.post({url:url, form: postUserData}, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });


    it("returns access_token should be string", function(done) {

        request.post({url:url, form: postUserData}, function(error, response, body) {
            var result = JSON.parse(body);
            expect(result.access_token).to.be.a('string');
            expect(result.access_token.length).to.above(10);
            done();
        });
    });



});




describe("API Submit New Order", function() {

    var url = apiPath + "user/token";
    var url2 = apiPath + "orders";

    var token = {
        Authorization : 'Bearer '
    };


    var postdata = {
        "cookingType": "ready to eat",
        "clientFrom": "wechat",
        "credit": 0,
        "freight": 5,
        "payment": "alipay direct",
        "paymentUsedCash": false,
        "deliveryDateEat": "2016-02-25",
        "deliveryTimeEat": "12:00",
        "deliveryDateCook": "2016-02-25",
        "deliveryTimeCook": "12:00",
        "addressId": "56d41b76628ca753a757bf13",
        "dishList": [
            {
                "dish": "5636e1c345a39ea057573101",
                "number": 3,
                "subDish": [
                    {
                        "dish": "55cd9fed9cbe20902858618e",
                        "number": 3
                    }
                ]
            },
            {
                "dish": "55d57351473236af447f6fa1",
                "number": 1,
                "subDish": []
            }
        ]
    };


    before(function(done) {
        request.post({url:url, form: postUserData}, function(error, response, body) {
            var result = JSON.parse(body);
            token.Authorization = token.Authorization + result.access_token;
            //console.log(token.Authorization);
            done();
        });
    });


    it("returns status 200", function(done) {

        request.post({url:url2, form: postdata, headers:token}, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });


    it("returns new order should be string", function(done) {

        request.post({url:url2, json: postdata, headers:token}, function(error, response, body) {
            //var result = JSON.parse(body);
            expect(body._id).to.be.a('string');
            expect(body._id.length).to.above(23);
            done();
        })
    });



});



