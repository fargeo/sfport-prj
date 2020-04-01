define([
    'knockout',
    'underscore',
    'viewmodels/card-component',
    'bindings/formattedNumber'
], function(ko, _, CardComponentViewModel) {
    return ko.components.register('contingency-card', {
        viewModel: function(params) {
            CardComponentViewModel.apply(this, [params]);
            var self = this;

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

            this.contingencyAmount = ko.pureComputed(function() {
                var value;
                if (self.tile) {
                    value = ko.unwrap(self.tile.data['a5de70f8-19d6-11e9-ba47-acde48001122']);
                } else if (self.card.tiles()) {
                    _.each(self.card.tiles(), function(tile){
                        if (tile.data) {
                            _.each(tile.data, function(v, k){
                                if (k === 'a5de70f8-19d6-11e9-ba47-acde48001122') {
                                    value = ko.unwrap(v);
                                }
                            })
                        }
                    })
                }
                return !!value ? value * 0.10 : 0;
            }, this);

            this.contingencyRemaining =  ko.pureComputed(function(){
                var changeOrderSum =  sumById(
                    'a5de75d9-19d6-11e9-9e07-acde48001122'
                );
                var contingencyAmt = this.contingencyAmount()
                return ((contingencyAmt - changeOrderSum)/contingencyAmt);
            }, this);

        },
        template: {
            require: 'text!templates/views/components/card_components/contingency-card.htm'
        }
    });
});
