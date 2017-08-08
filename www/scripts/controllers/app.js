app.controller('AppController', function ($scope, $ionicModal, $timeout, $state, DataSource, $cordovaSQLite, Products) {
    console.log('app controller');

    var query = "SELECT * FROM t_category";

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
                            tree[parentId].tree = [];
                        }
                        tree[parentId].tree[tree[parentId].tree.length] = item;
                        tree[id] = item;
                    }
                    else {
                        tree[id] = {parentId: parentId, name: name, item: item, id: id};
                        source.push(tree[id]);
                        // source[id] = tree[id];
                    }
                }
                return source;
            }
            var source = builddata();
            $scope.tasks = source;

        } else {
            console.log("No results found");
        }
    }, function (err) {
        console.error(err);
    });

    $scope.collapse = true;

    $scope.customTemplate = 'item_default_renderer';


    $scope.goToCart = function () {
        $state.go('app.cart');
    };

    $scope.goToGallery = function () {
        $state.go('app.gallery');
    };
})
