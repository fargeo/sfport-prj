define([
    'knockout',
    'underscore',
    'viewmodels/card-component'
], function(ko, _, CardComponentViewModel) {
    return ko.components.register('engineering-card', {
        viewModel: function(params) {
            var self = this;
            params.configKeys = [];

            CardComponentViewModel.apply(this, [params]);

            var sumById = function(nodeId) {
                var total = 0;
                self.tiles().forEach(function(tile) {
                    var value = ko.unwrap(tile.data[nodeId]);
                    if (value) {
                        total += parseFloat(value);
                    }
                });
                return total;
            };

            this.totalFunds = ko.computed(function() {
                return sumById(
                    // funding amount
                    'a4332063-19d6-11e9-bdaf-acde48001122'
                );
            }, this);

            this.encumbrances = ko.computed(function() {
                return sumById(
                    // change order amount
                    'a5de75d9-19d6-11e9-9e07-acde48001122'
                ) + sumById(
                    // contract amount
                    'a5de70f8-19d6-11e9-ba47-acde48001122'
                );
            }, this);

            this.balance = ko.computed(function() {
                return this.totalFunds() - this.encumbrances();
            }, this);

            this.showChildCards = ko.observable(true);

            this.createParentAndChild = function (parenttile, childcard) {
                if (parenttile.tileid === "") {
                    var callback = function(){childcard.selected(true);}
                    parenttile.save(function() {
                        return;
                    }, callback);
                }
            };

        },
        template: {
            require: 'text!templates/views/components/card_components/engineering-card.htm'
        }
    });
});
