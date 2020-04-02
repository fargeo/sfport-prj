define([
    'knockout',
    'underscore',
    'viewmodels/card-component'
], function(ko, _, CardComponentViewModel) {
    return ko.components.register('capital-card', {
        viewModel: function(params) {
            var self = this;
            params.configKeys = [];

            CardComponentViewModel.apply(this, [params]);

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
            require: 'text!templates/views/components/card_components/capital-card.htm'
        }
    });
});
