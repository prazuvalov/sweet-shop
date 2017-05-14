angular.module('order').controller('allOrdersCtrl', [
    '$scope',
    '$state',
    'Order',
    'OrderAll',
    'ErrorHandler',
    'NotificationService',
    'ToolbarService',
    'TitleService',
    'currentUser',
    function ($scope,
              $state,
              Order,
              OrderAll,
              ErrorHandler,
              NotificationService,
              ToolbarService,
              TitleService,
              currentUser) {
        if (currentUser.role !== 'Admin'){
            $state.go('app.stuff');
            NotificationService.show('Access denied');
        }
        else {
            ToolbarService.set('User orders', null, null, null);
            TitleService.set('User orders');
            OrderAll.query(function (res) {
                $scope.orders = res;
            }, function (err) {
                ErrorHandler.show(err);
            });

            $scope.finish = function (id, comment) {
                console.log($scope.status_comment);
                Order.finish({orderId: id},{comment: comment}, function () {
                    NotificationService.show('Order has been finished');
                    $state.go($state.current.name,{},{reload: true});
                }, function (err) {
                    ErrorHandler.show(err);
                })
            };

            $scope.cancel = function (id, comment) {
                console.log($scope.status_comment);
                Order.cancel({orderId: id}, {comment: comment}, function () {
                    NotificationService.show('Order has been canceled');
                    $state.go($state.current.name,{},{reload: true});
                }, function (err) {
                    ErrorHandler.show(err);
                })
            };

            $scope.delete = function (id) {
                Order.delete({orderId: id}, function () {
                    NotificationService.show('Order has been deleted');
                    $state.go($state.current.name,{},{reload: true});
                }, function (err) {
                    ErrorHandler.show(err);
                })
            }
        }
    }
]);