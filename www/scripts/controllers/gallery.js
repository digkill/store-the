app.controller('GalleryController', [
    '$scope',
    '$state',
    '$ionicSideMenuDelegate',
    'Products',
    'stripeCheckout',
    'DataSource',
    '$cordovaSQLite',
    function ($scope, $state, $ionicSideMenuDelegate, Products, stripeCheckout, DataSource, $cordovaSQLite) {

        var query = "SELECT * FROM t_product LIMIT 1000";

        $cordovaSQLite.execute(db, query, []).then(function (res) {
            if (res.rows.length > 0) {
                for (var i = 0; i < res.rows.length; i++) {
                    var prod = {};
                    var imgArr = [];
                    prod.id = res.rows[i].pid;
                    prod.title = res.rows[i].title;
                    imgArr.push(res.rows[i].image);
                    prod.images = imgArr;
                    prod.description = res.rows[i].description;
                    prod.available = res.rows[i].available;
                    prod.price = res.rows[i].price;
                    prod.categoryId = res.rows[i].categoryId;
                    Products.galleryProducts.push(prod);
                }

                $scope.products = Products.galleryProducts;


            } else {
                console.log("No results found");
            }
        }, function (err) {
            console.error(err);
        });





    }]);

