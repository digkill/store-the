app.controller('ShopController', [
    '$scope',
    '$state',
    '$ionicSideMenuDelegate',
    'Products',
    'stripeCheckout',
    'DataSource',
    '$cordovaSQLite',
    '$stateParams',
    function ($scope, $state, $ionicSideMenuDelegate, Products, stripeCheckout, DataSource, $cordovaSQLite, $stateParams) {
        var params = $stateParams;
        var query = "SELECT * FROM t_category";
        var cats = {};
        $cordovaSQLite.execute(db, query, []).then(function (res) {
            if (res.rows.length > 0) {
                Products.galleryProducts = [];
                for (var i = 0; i < res.rows.length; i++) {
                    var cat = {};
                    cat.cid = res.rows[i].cid;
                    cat.id = res.rows[i].id;
                    cat.name = res.rows[i].title;
                    cat.parentId = res.rows[i].parentId;
                    Products.galleryCategories.push(cat);
                }
                var data = Products.galleryCategories;

                var builddata = function () {
                    var source = [];
                    var tree = [];
                    // build hierarchical source.
                    for (i = 0; i < data.length; i++) {
                        var item = data[i];
                        var name = item["name"];
                        var parentId = item["parentId"];
                        var id = item["id"];

                        if (tree[parentId]) {
                            var item = {parentId: parentId, name: name, item: item, id: id};
                            if (!tree[parentId].tree) {
                                tree[parentId].tree = {};
                            }
                            tree[parentId].tree[item.id] = item;
                            tree[id] = item;
                        }
                        else {
                            tree[id] = {parentId: parentId, name: name, item: item, id: id};
                            // source.push(tree[id]);
                            source[id] = tree[id];

                        }
                    }
                    return source;
                }
                var source = builddata();
                console.log(source);
                addDepthToTree(source[4]);
                

                console.log(cats);


            } else {
                console.log("No results found");
            }
        }, function (err) {
            console.error(err);
        });


        function addDepthToTree(obj) {
            console.log(key);
            for (var key in obj) {
                if (typeof (obj[key]) == 'object') {
                    if (typeof obj.tree == "undefined") {
                        cats[obj.id] = obj.id;
                    }
                    addDepthToTree(obj[key]);
                }
            }
            return obj
        }

        /*
         
         
         var query = "SELECT * FROM t_category WHERE id=" + params.categoryId;
         
         $cordovaSQLite.execute(db, query, []).then(function (res) {
         if (res.rows.length > 0) {
         var category = [];
         for (var i = 0; i < res.rows.length; i++) {
         var cat = {};
         cat.cid = res.rows[i].cid;
         cat.id = res.rows[i].id;
         cat.name = res.rows[i].title;
         cat.parentId = res.rows[i].parentId;
         category.push(cat);
         }
         
         
         
         } else {
         console.log("No results found");
         }
         }, function (err) {
         console.error(err);
         });
         
         
         
         
         /*
         
         var query = "SELECT * FROM t_product WHERE categoryId = " + params.categoryId;
         
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
         console.log($scope.products);
         
         } else {
         console.log("No results found");
         }
         }, function (err) {
         console.error(err);
         });
         */

    }]);

