angular.module('ionicShopCtrl.service', []).
        factory('DataSource', ['$http', function ($http) {
                return {
                    get: function (file, callback, transform) {
                        $http.get(
                                file,
                                {transformResponse: transform}
                        ).
                                success(function (data, status) {
                                    console.log("Request succeeded");
                                    callback(data);
                                }).
                                error(function (data, status) {
                                    console.log("Request failed " + status);
                                });
                    }
                };
            }]);

var app = angular.module('ionicShopCtrl', ['ionic', 'ionicShop', 'ionicShopCtrl.service', 'ngCordova', 'ion-tree-list']);

var db = null;


app.run(function ($ionicPlatform, $cordovaSQLite, stripeCheckout, $http, DataSource) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }

        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

        // if browser || device
        if (window.cordova) {
            db = $cordovaSQLite.openDB({name: "shop.db"}); //device
        } else {
            db = window.openDatabase("shop.db", '1', 'my', 1024 * 1024 * 100); // browser
        }


        //      $cordovaSQLite.execute(db, "DROP TABLE t_category");
        //       $cordovaSQLite.execute(db, "DROP TABLE t_product");

        //      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS t_category (cid integer primary key, title text, id integer, parentId integer)");
        //          $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS t_product (pid integer primary key, title text, categoryId integer, image text, url text, description text, currencyId text, price real, available integer)");


        var SOURCE_FILE = "store.xml";


        xmlTransform = function (data) {
            console.log("transform data");
            var x2js = new X2JS();
            var json = x2js.xml_str2json(data);
            return json;
        };

        setData = function (data) {


            var dataJson = {
                product: data.yml_catalog.shop.offers.offer,
                category: data.yml_catalog.shop.categories.category
            };


            var query = "INSERT INTO t_category (title, id, parentId) VALUES (?,?,?)";
            for (var i = 0; i < dataJson.category.length; i++) {

                if (typeof dataJson.category[i]._parentId === 'undefined') {
                    dataJson.category[i]._parentId = 0;
                }

                $cordovaSQLite.execute(db, query, [dataJson.category[i].__text, dataJson.category[i]._id, dataJson.category[i]._parentId]).then(function (res) {
                    console.log("INSERT ID -> " + res.insertId);
                }, function (err) {
                    console.error(err);
                });

            }
            console.log(dataJson.product);
            query = "INSERT INTO t_product (title, categoryId, image, url, description, currencyId, price, available) VALUES (?,?,?,?,?,?,?,?)";
            for (var i = 0; i < 100; i++) {
                var prod = {};

                prod.title = dataJson.product[i].name;
                prod.categoryId = dataJson.product[i].categoryId;
                prod.image = dataJson.product[i].picture;
                prod.url = dataJson.product[i].url;
                prod.description = dataJson.product[i].description;
                prod.currencyId = dataJson.product[i].currencyId;
                prod.price = dataJson.product[i].price;
                prod.available = dataJson.product[i]._available === 'true' ? 1 : 0;

                $cordovaSQLite.execute(db, query, [prod.title, prod.categoryId, prod.image, prod.url, prod.description, prod.currencyId, prod.price, prod.available]).then(function (res) {
                    console.log("INSERT Product ID -> " + res.insertId);
                }, function (err) {
                    console.error(err);
                });
            }


        };

        //   DataSource.get(SOURCE_FILE, setData, xmlTransform);



    });




    stripeCheckout.setStripeKey('pk_test_hXnwnglXuPWNu5NRmmJJdrwX');

    stripeCheckout.setStripeTokenCallback = function (status, response, products) {
        console.log(status, response, products);
        $http.post('/app/stripe/pay', {
            stripeToken: response.id,
            products: products
        })
                .success(function (data) {
                    console.log(data);
                });
    };

});

app.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'views/menu.html',
                controller: 'AppController'
            })

            .state('app.cart', {
                url: '/cart',
                views: {
                    'menuContent': {
                        templateUrl: 'views/cart.html',
                        controller: 'CartController'
                    }
                }
            })
            .state('app.checkout', {
                url: '/checkout',
                views: {
                    'menuContent': {
                        templateUrl: 'views/checkout.html',
                        controller: 'CheckoutController'
                    }
                }
            })


            .state('app.gallery', {
                url: '/gallery',
                views: {
                    'menuContent': {
                        templateUrl: 'views/gallery.html',
                        controller: 'GalleryController'
                    }
                }
            })

            .state('app.shop', {
                url: '/shop/:categoryId',
                views: {
                    'menuContent': {
                        templateUrl: 'views/shop.html',
                        controller: 'ShopController'
                    }
                }
            })

    $urlRouterProvider.otherwise('/app/gallery');

});
