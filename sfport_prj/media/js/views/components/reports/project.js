define(['underscore', 'knockout', 'knockout-mapping', 'viewmodels/report', 'views/components/widgets/map'], function(_, ko, koMapping, ReportViewModel) {
    return ko.components.register('project-report', {
        viewModel: function(params) {
            var self = this;
            params.configKeys = ['zoom', 'centerX', 'centerY', 'geocoder', 'basemap', 'geometryTypes', 'pitch', 'bearing', 'geocodePlaceholder'];

            ReportViewModel.apply(this, [params]);

            this.featureCollection = ko.computed({
                read: function() {
                    var features = [];
                    ko.unwrap(self.tiles).forEach(function(tile) {
                        _.each(tile.data, function(val, key) {
                            if ('features' in val) {
                                var newFeatures = koMapping.toJS(val.features);
                                newFeatures.forEach(function(feature) {
                                    if (key === '0b3af068-20e5-11e9-a6cd-acde48001122') {
                                        feature.properties.type = "subproject";
                                        // subproject name
                                        feature.properties['feature_info_content'] = '<h4>Subproject: ' + tile.data['dbf4e175-20e4-11e9-97ee-acde48001122']() + '</h4><hr>' +
                                            // subproject description
                                            '<div>' + tile.data['f6f2d619-20e4-11e9-bd9b-acde48001122']() + '</div>';
                                    } else if (key === '5123be0f-e9e8-11e8-a934-acde48001122') {
                                        feature.properties.type = "project";
                                    } else {
                                        feature.properties.type = "other";
                                    }
                                });
                                features = features.concat(newFeatures);
                            }
                        }, this);
                    }, this);
                    return {
                        type: 'FeatureCollection',
                        features: features
                    };
                },
                write: function() {
                    return;
                }
            });

            this.featureCount = ko.computed(function() {
                var count = 0;
                ko.unwrap(self.tiles).forEach(function(tile) {
                    _.each(tile.data, function(val) {
                        if ('features' in val) {
                            count += 1;
                        }
                    }, this);
                }, this);
                return count;
            });

            this.onInit = function(map) {
                if (map) {
                    map.on('load', function () {
                        var polyLayer = map.getLayer('resource-poly' + params.report.graph.graphid);
                        var lineLayer = map.getLayer('resource-line' + params.report.graph.graphid);
                        polyLayer.setPaintProperty('fill-color', [
                            "case",
                            ["==", ["get", "type"], "subproject"],
                            "rgba(48, 228, 252, 0.5)",
                            "transparent"
                        ]);
                        lineLayer.setPaintProperty('line-color', [
                            "case",
                            ["==", ["get", "type"], "subproject"],
                            "rgba(48, 228, 252, 0.7)",
                            "rgba(48, 111, 252, 0.5)"
                        ]);
                        lineLayer.setPaintProperty('line-width', [
                            "case",
                            ["==", ["get", "type"], "project"],
                            6,
                            2
                        ]);
                        map.setFilter(lineLayer.id);
                    });
                }
            }
        },
        template: { require: 'text!templates/views/components/reports/project.htm' }
    });
});
