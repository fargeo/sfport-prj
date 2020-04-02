define([
    'knockout',
    'knockout-mapping',
    'mapbox-gl',
    'geojson-extent',
    'views/components/widgets/map'
], function (ko, koMapping, mapboxgl, geojsonExtent, MapWidgetViewModel) {
    return ko.components.register('subproject-location', {
        viewModel: function(params) {
            var self = this;
            var projectGeoJSON = {
                type: 'FeatureCollection',
                features: []
            };
            if (params.tile && params.tile.parent && params.tile.parent.parent && params.tile.parent.parent.parent) {
                params.tile.parent.tiles().forEach(function(tile) {
                    if (tile.tileid !== params.tile.tileid) {
                        var features = []
                        if (tile.data[params.node.nodeid].features) {
                            var features = koMapping.toJS(
                                tile.data[params.node.nodeid].features
                            );
                        }
                        features.forEach(function(feature) {
                            feature.properties.type = 'subproject';
                            projectGeoJSON.features.push(feature);
                        });
                    }
                });
                params.tile.parent.parent.parent.topCards.forEach(function(card) {
                    if (card.nodegroupid === '5123cc97-e9e8-11e8-bb13-acde48001122') {
                        card.tiles().forEach(function(tile) {
                            tile.cards.forEach(function(card) {
                                if (card.nodegroupid === '5123be0f-e9e8-11e8-a934-acde48001122') {
                                    var tiles = card.tiles();
                                    if (tiles.length > 0) {
                                        var features = koMapping.toJS(
                                            tiles[0].data['5123be0f-e9e8-11e8-a934-acde48001122'].features
                                        )
                                        features.forEach(function(feature) {
                                            feature.properties.geojson = feature.geometry;
                                            feature.properties.type = 'project';
                                            projectGeoJSON.features.push(feature);
                                        });
                                    }
                                }
                            });
                        });
                    }
                });
            }
            
            params.layers = [
                {
                    "id": "subproject-projects-fill",
                    "type": "fill",
                    "source": "subproject-geojson",
                    "layout": {
                        "visibility": "visible"
                    },
                    "filter": ["all", ["==", "$type", "Polygon"]],
                    "paint": {
                        "fill-color": [
                            "case",
                            ["==", ["get", "type"], "subproject"],
                            "rgba(48, 228, 252, 0.5)",
                            "transparent"
                        ]
                    }
                },
                {
                    "id": "subproject-projects-line",
                    "type": "line",
                    "source": "subproject-geojson",
                    "layout": {
                        "visibility": "visible"
                    },
                    "paint": {
                        "line-width": [
                            "case",
                            ["==", ["get", "type"], "project"],
                            6,
                            2
                        ],
                        "line-color": [
                            "case",
                            ["==", ["get", "type"], "project"],
                            "rgba(48, 111, 252, 0.5)",
                            "rgba(48, 228, 252, 0.9)"
                        ]
                    }
                }
            ];
            
            params.sources = {
                'subproject-geojson': {
                    'type': 'geojson',
                    'data': projectGeoJSON
                }
            };
            
            MapWidgetViewModel.apply(this, [params]);
            
            self.map.subscribe(function(map) {
                if (map && projectGeoJSON.features.length > 0) {
                    var bounds = new mapboxgl.LngLatBounds(geojsonExtent(projectGeoJSON));
                    var tr =  map.transform;
                    var nw = tr.project(bounds.getNorthWest());
                    var se = tr.project(bounds.getSouthEast());
                    var size = se.sub(nw);
                    var scaleX = (tr.width - 80) / size.x;
                    var scaleY = (tr.height - 80) / size.y;
                    map.jumpTo({
                        center: tr.unproject(nw.add(se).div(2)),
                        zoom: Math.min(tr.scaleZoom(tr.scale * Math.min(scaleX, scaleY)), 17)
                    });
                }
            });
        },
        template: { require: 'text!widget-templates/map' }
    });
});
