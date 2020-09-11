define([
    'jquery',
    'knockout',
    'arches',
    'views/components/widgets/map',
    'views/components/widgets/resource-instance-multiselect',
    'plugins/knockout-select2'
], function($, ko, arches) {
    return ko.components.register('mitigations-dashboard-plugin', {
        viewModel: function() {
            var self = this;
            
            this.projects = ko.observableArray();
            this.selectedProjectIds = ko.observableArray();
            this.selectedProjects = ko.observableArray([])
            this.subProjects = ko.observableArray([])
            this.selectedSubProjectIds = ko.observableArray([]);
            this.mitigations = ko.observableArray([]);
            this.tableData = ko.observableArray([]);
            this.domainValueLookup = [];
            
            var nodeDict = {
                //keys
                referencedMitigation : "0cd9ef99-20e8-11e9-8e29-acde48001122",
                mitigStatus: "0cd9fbab-20e8-11e9-9ed6-acde48001122",
                mitigBeginDate: "0cd9f828-20e8-11e9-838b-acde48001122",
                mitigEndDate: "0cda01b0-20e8-11e9-ab41-acde48001122",
                mitigTrigExpl: "e1bfa36b-20f7-11e9-bb1b-acde48001122",
                mitigResp: "0cda02e6-20e8-11e9-b01c-acde48001122"
            };
            
            this.projectSelect2Config = {
            value: this.selectedProjectIds,
            clickBubble: true,
            multiple: true,
            placeholder: "Select a project",
            allowClear: true,
            ajax: {
                url: arches.urls.search_results,
                dataType: 'json',
                quietMillis: 250,
                data: function(term, page) {
                    var data = { 
                        'paging-filter': page,  
                        "resource-type-filter":{
                            "graphid":"07054980-e154-11e8-9e11-0c4de9ce7b44",
                            "name":"Port of SF Projects",
                            "inverted":false
                        },
                        "precision": 6,
                        "tiles": true,
                        "total": 0,
                        };
                    if (term) {
                        data['advanced-search'] = JSON.stringify([{
                            "op":"and",
                            "5123d9de-e9e8-11e8-b2d0-acde48001122":{"op":"~","val":""},
                            "5123d64a-e9e8-11e8-b74f-acde48001122":{"op":"~","val":""},
                            "5123d6fa-e9e8-11e8-8a75-acde48001122":{"op":"~","val":term},
                            "e5c051b5-54d0-11e9-8b4b-acde48001122":{"op":"","val":""},
                            "5123de2b-e9e8-11e8-b989-acde48001122":{"op":"eq","val":""},
                            "5123da9e-e9e8-11e8-8d7a-acde48001122":{"op":"","val":""},
                            "5123dcc5-e9e8-11e8-b1fd-acde48001122":{"op":"~","val":""}
                        }]);
                    }
                    return data;
                },
                results: function(data, page) {
                    var resource_instances = [];
                    data.results.hits.hits.forEach(function(d) {
                        var instance = {};
                        instance.id = d._id
                        instance.text = d._source.displayname
                        resource_instances.push(instance);
                    })
                    self.projects(resource_instances.sort(function(a,b) {
                        return ((a.text.toLowerCase() < b.text.toLowerCase()) ? -1 : ((a.text.toLowerCase() > b.text.toLowerCase()) ? 1 : 0));
                    }));
                    return {
                        results: self.projects(),
                        more: data['paging-filter'].paginator.has_next
                    };
                }
            },
            id: function(item) {
                return item.id;
            },
            initSelection: function() {}
        };
            
            this.subProjectSelect2Config = {
                multiple: true,
                placeholder: 'Select a Sub-Project',
                data: this.subProjects,
                value: this.selectedSubProjectIds
            };
            
            this.populateDomainLookup = function(graphid, domainNodeIds) {
                fetch(arches.urls.graphs_api + graphid + '?format=json')
                .then(function(response) {
                    if (response.ok) {
                        return response.json()
                        }
                    })
                    .then(function(graph) {
                        var domainNodes = graph.graph.nodes.filter(function(node) {
                            return domainNodeIds.indexOf(node.nodeid) > -1
                        })
                        domainNodes.forEach(function(domainNode) {
                            domainNode.config.options.forEach(function(option) {
                                self.domainValueLookup.push(option)
                            })
                        })
                    })
            }
            this.populateDomainLookup('07054980-e154-11e8-9e11-0c4de9ce7b44', new Array(nodeDict.mitigStatus, nodeDict.subProjMitigTriggers));            
            
            this.getSubProjects = function(projectIds) {
                self.subProjects.removeAll();
                projectIds.forEach(function(value) {
                    fetch(arches.urls.api_resources(value) + '?format=json')
                        .then( function(response) {
                            if (response.ok) {
                              return response.json()  
                            }
                        })
                        .then(function(data) {
                            if (typeof data !== "undefined" && data.tiles) {
                                self.selectedProjects(data.tiles);
                                var res = data.tiles.filter(function(tile) {
                                    return tile.nodegroup_id == 'c9fff851-20e4-11e9-8072-acde48001122'
                                }, this)
                                res.forEach(function(r) {
                                    r.id = r.tileid;
                                    r.text = r.data['dbf4e175-20e4-11e9-97ee-acde48001122'];
                                });
                                self.subProjects(self.subProjects().concat(res));
                                self.subProjects.sort(function(a,b) {
                                    return ((a.text.toLowerCase() < b.text.toLowerCase()) ? -1 : ((a.text.toLowerCase() > b.text.toLowerCase()) ? 1 : 0));
                                })
                        }
                    })
                }, this)
            };
            
            this.populateTableData = function (list, tileids) {
                var results = [];
                var mitigations = this.mitigations(list().filter(function(l) {
                    return tileids.indexOf(l.parenttile_id) > -1
                }), this);
            
                this.mitigations().forEach( function (mitigation) {
                    results.push([
                        $('<p></p>').text(
                            this.lookupReferencedMitigation(mitigation.data[nodeDict.referencedMitigation]))
                            [0].outerHTML,
                        $('<p></p>').text(
                            this.lookupDomainValue(mitigation.data[nodeDict.mitigStatus]))
                            [0].outerHTML,
                        $('<p></p>').text(
                            mitigation.data[nodeDict.mitigBeginDate])
                            [0].outerHTML,
                        $('<p></p>').text(
                            mitigation.data[nodeDict.mitigEndDate])
                            [0].outerHTML,
                        $('<p></p>').text(
                            mitigation.data[nodeDict.mitigTrigExpl])
                            [0].innerText,
                        $('<p></p>').text(
                            mitigation.data[nodeDict.mitigResp])
                            [0].outerHTML,
                    ]);
                }, this);
                
                self.tableData(results);
            };
            
            this.lookupReferencedMitigation = function(mitigationTileId) {
                var referencedMitigations = []
                var res = self.selectedProjects().filter(function(tile) {
                    return tile.tileid == mitigationTileId
                })
                res.forEach(function(r) {
                    referencedMitigations.push(r.data['2a8346b0-20e6-11e9-96b7-acde48001122'])
                })
                return referencedMitigations.join(', ')
            }
            
            this.lookupDomainValue = function(domainValueId) {
                var domainValueText = []
                var domainValueObjs = self.domainValueLookup.forEach(function(domain) {
                    if (domain.id == domainValueId) {
                        domainValueText.push(domain.text)
                    }
                })
                return domainValueText.join(', ')
            }
            
            this.selectedSubProjectIds.subscribe(function(value) {
                this.populateTableData(self.selectedProjects, value)
            }, this);
            
            this.selectedProjectIds.subscribe(function(val) {
                var selectedProjectIds = [];
                if (val.indexOf(',') > -1) {
                    val.split(',').forEach(function(v) {
                        selectedProjectIds.push(v);
                    })
                }
                else {
                    selectedProjectIds = val;
                }
                self.getSubProjects(selectedProjectIds);
            }, this);

            this.dataReady = ko.observable(true);
            this.columnVis = [
                ko.observable(true),
                ko.observable(true),
                ko.observable(true),
                ko.observable(true),
                ko.observable(true),
                ko.observable(true),
                ko.observable(true)
            ];
            this.toggle = function(col) {
                var visible = self.columnVis[col]();
                self.columnVis[col](!visible);
            }
            
            this.tableConfig = {
                columnVis: self.columnVis,
                scrollY: "50vh",
                data: self.tableData,
                paging: false,
                dom: "<'row'<'col-sm-6'B><'col-sm-6'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-5'i><'col-sm-7'p>>",
                buttons: [
                    {
                        extend: 'print',
                        customize: function ( win ) {
                            $(win.document.body)
                                .css( 'margin-right', '2' )

                            $(win.document.body).find( '#DataTables_Table_0' )
                                .addClass( 'compact' )
                                .css( 'font-size', 'inherit' );
                        },
                        exportOptions: {
                            columns: ':visible'
                        }
                    },
                    {
                        extend: 'csv',
                        exportOptions: {
                            columns: ':visible'
                        }
                    },
                    {
                        extend: 'copy',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }
                ]
            };
        },
        template: { require: 'text!templates/views/components/plugins/mitigations_dashboard.htm' }
    });
});
