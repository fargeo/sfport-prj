define([
    'knockout',
    'underscore',
    'moment',
    'viewmodels/card-component',
    'bindings/formattedNumber'
], function(ko, _, moment, CardComponentViewModel) {
    return ko.components.register('subproject-card', {
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

            this.calculatedNodes = {
                mitigations: '70883880-526e-11e9-83b1-acde48001122',
                mitigationsPending: 'aec5620a-526e-11e9-b901-acde48001122',
                mitigationsComplete: '9ca7deb8-526e-11e9-a046-acde48001122',
                mitigationsCompletionDate: 'ce7c5fe8-526e-11e9-8d3e-acde48001122'
            }

            this.mitigations = function(parenttile){
                var value;
                value = self.tiles().filter(
                    function(tile){
                        return tile.parent.nodegroupid === '0cd9e70a-20e8-11e9-91d2-acde48001122' &&
                        tile.parent.parent.tileid === parenttile.tileid
                    }).length;
                return !!value ? value : 0;
                };

            this.mitigationsPending = function(parenttile){
                var value;
                value = self.tiles().filter(
                    function(tile) {
                        return tile.parent.nodegroupid === '0cd9e70a-20e8-11e9-91d2-acde48001122' &&
                            tile.parent.parent.tileid === parenttile.tileid &&
                            ko.unwrap(tile.data['0cd9fbab-20e8-11e9-9ed6-acde48001122']) !== 'fe31157c-68f4-4588-a209-ee3ea40657f0'}).length;
                return !!value ? value : 0;
                };

            this.mitigationsComplete = function(parenttile){
                var value;
                value = self.tiles().filter(
                    function(tile){
                        return tile.parent.nodegroupid === '0cd9e70a-20e8-11e9-91d2-acde48001122' &&
                            tile.parent.parent.tileid === parenttile.tileid &&
                            ko.unwrap(tile.data['0cd9fbab-20e8-11e9-9ed6-acde48001122']) === 'fe31157c-68f4-4588-a209-ee3ea40657f0'}).length;
                return !!value ? value : 0;
                };


            this.mitigationsCompletionDate = function(parenttile){
                var value;
                var date;
                self.tiles().forEach(function(tile){
                    if (ko.unwrap(tile.data['0cd9fbab-20e8-11e9-9ed6-acde48001122']) !== 'fe31157c-68f4-4588-a209-ee3ea40657f0' &&
                        tile.parent.parent.tileid === parenttile.tileid) {
                        var currentdate = ko.unwrap(tile.data['0cda01b0-20e8-11e9-ab41-acde48001122'])
                        if (currentdate) {
                            if (!date) {
                                date = moment(currentdate);
                            } else {
                                if (date < moment(currentdate)) {
                                    date = moment(currentdate)
                                }
                            }
                        }
                    }
                });
                if (date) {
                    value = date.format('YYYY-MM-DD');
                }
                return !!value ? value : 'No pending mitigations';
            };
        },
        template: {
            require: 'text!templates/views/components/card_components/subproject-card.htm'
        }
    });
});
