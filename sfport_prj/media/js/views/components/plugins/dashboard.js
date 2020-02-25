define([
    'jquery',
    'knockout',
    'arches',
    'views/components/widgets/map'
], function($, ko, arches) {
    return ko.components.register('dashboard-plugin', {
        viewModel: function() {
            var self = this;
            function queryStringFilters() {
                var url = new URL(document.referrer);
                var searchParams = new URLSearchParams(url.search);
                var dataObj = {
                    no_filters: false,
                    page: 1,
                    tiles: 1,
                    limit: 10000
                };
                searchParams.forEach(function(value, key) {
                    if(value != null) {
                        dataObj[key]=value;
                    }
                });
                return dataObj;
            }

            function getPorts() {
                return $.getJSON(
                    arches.urls.dropdown,
                    {
                        conceptid: "90b1db46-74a5-48b7-b042-73999ea5b631"
                    },
                    function(data) {
                        return data;
                    }
                );
            }

            var ports;

            function optionSelect (tile, nodeStatus, statusOptns, multiSelect) {
                var result = "";
                if (!multiSelect) {
                    for(var j = 0; j < statusOptns["options"].length; j++) {
                        if (tile.data[nodeStatus] === statusOptns["options"][j]["id"]) {
                            result = statusOptns["options"][j]["text"];
                        }
                    }
                } else {
                    for(var j = 0, k = 0; j < statusOptns["options"].length; j++) {
                        if (tile.data[nodeStatus][k] === statusOptns["options"][j]["id"]) {
                            if (result == "") {
                                result = statusOptns["options"][j]["text"]; k++; j = 0;
                            } else {
                                result += ", "+ statusOptns["options"][j]["text"]; k++; j = 0;
                            }
                        }
                    }
                }
                return result;
            }

            var nodeDict = {
                //keys
                facilities: "5123d421-e9e8-11e8-96be-acde48001122", //multi
                contractNumber: "a5de703a-19d6-11e9-a0fe-acde48001122",
                EngStaffing: "0705cc28-e154-11e8-a671-0c4de9ce7b44",
                projectLead: "5123d9de-e9e8-11e8-b2d0-acde48001122",
                staffName: "0706bd2e-e154-11e8-b148-0c4de9ce7b44",
                staffType: "0706d9d9-e154-11e8-a481-0c4de9ce7b44", //multi
                designStatus: "070684b0-e154-11e8-b90d-0c4de9ce7b44",
                constStatus: "0706968c-e154-11e8-8b4e-0c4de9ce7b44",
                buildPermitNumber: "07067d0a-e154-11e8-8109-0c4de9ce7b44",
                buildPermitReq: "0706c561-e154-11e8-8851-0c4de9ce7b44",
                encroachPermitNumber: "0706ca80-e154-11e8-8938-0c4de9ce7b44",
                encroachPermitReq: "07069c40-e154-11e8-9a63-0c4de9ce7b44",
                envSpecs: "ee19ef11-2022-11e9-827e-acde48001122", //multi

                mitigName: "2a8346b0-20e6-11e9-96b7-acde48001122",
                mitigId: "0cd9ef99-20e8-11e9-8e29-acde48001122", //only in appliedToSubProj tile
                subProjMitigTriggers: "119861eb-20f7-11e9-ad21-acde48001122", //multi
                mitigStatus: "0cd9fbab-20e8-11e9-9ed6-acde48001122",
                mitigBeginDate: "0cd9f828-20e8-11e9-838b-acde48001122",
                mitigEndDate: "0cda01b0-20e8-11e9-ab41-acde48001122",
                mitigTrigExpl: "e1bfa36b-20f7-11e9-bb1b-acde48001122",

                planApprovedBy: "07069fae-e154-11e8-bc43-0c4de9ce7b44",
                planApprovedDate: "07069587-e154-11e8-b078-0c4de9ce7b44",
                envApprovedBy: "f224633a-20e3-11e9-9167-acde48001122",
                envApprovedDate: "f22460ba-20e3-11e9-8d2b-acde48001122",

                //valTypes
                projectEngineer: "512e8e50-1b7f-4626-bb50-eccc4f601219", //valType: Project Engineer
                projectManager: "e6607df2-2704-4928-ad74-42fe9780e792" //valType: Project Manager
            };

            var configObjDict = {
                "070684b0-e154-11e8-b90d-0c4de9ce7b44": { //designStatus
                    "options": [
                        {
                            "id": "8f56ae16-5c1c-4ca3-8967-58432d6a50b6",
                            "text": "To Start",
                            "selected": false
                        },
                        {
                            "id": "a7d4dd0c-1d6c-444e-b210-064c217ec4fd",
                            "text": "10%",
                            "selected": false
                        },
                        {
                            "id": "3aa5bbd2-fdb4-41d1-95da-ee1d1797bc52",
                            "text": "30%",
                            "selected": false
                        },
                        {
                            "id": "44e28a8c-9b78-4b9b-82b1-da93bb965bb0",
                            "text": "60%",
                            "selected": false
                        },
                        {
                            "id": "f809726e-c061-4955-85bb-d0f226db8b8e",
                            "text": "90%",
                            "selected": false
                        },
                        {
                            "id": "f74f1bde-e45a-49d7-8e26-886f89b50346",
                            "text": "100%",
                            "selected": false
                        },
                        {
                            "id": "15f76f0f-7998-47af-a913-19195fc7e5d5",
                            "text": "Hold",
                            "selected": false
                        }
                    ]
                },
                "0706968c-e154-11e8-8b4e-0c4de9ce7b44": { //constStatus
                    "options": [
                        {
                            "id": "8f56ae16-5c1c-4ca3-8967-58432d6a50b6",
                            "text": "Pre-Construction Phase",
                            "selected": false
                        },
                        {
                            "id": "a7d4dd0c-1d6c-444e-b210-064c217ec4fd",
                            "text": "Advertisement",
                            "selected": false
                        },
                        {
                            "id": "3aa5bbd2-fdb4-41d1-95da-ee1d1797bc52",
                            "text": "Bid",
                            "selected": false
                        },
                        {
                            "id": "44e28a8c-9b78-4b9b-82b1-da93bb965bb0",
                            "text": "Award",
                            "selected": false
                        },
                        {
                            "id": "f809726e-c061-4955-85bb-d0f226db8b8e",
                            "text": "NTP",
                            "selected": false
                        },
                        {
                            "id": "f74f1bde-e45a-49d7-8e26-886f89b50346",
                            "text": "30%",
                            "selected": false
                        },
                        {
                            "id": "15f76f0f-7998-47af-a913-19195fc7e5d5",
                            "text": "60%",
                            "selected": false
                        },
                        {
                            "id": "79bc5929-52e5-494f-8d9a-5a76f639259e",
                            "text": "Substantial (90%)",
                            "selected": false
                        },
                        {
                            "id": "27b21952-357e-4733-b424-b935bc85c0c5",
                            "text": "Complete (100%)",
                            "selected": false
                        },
                        {
                            "id": "51f83840-f04f-47be-88e5-8c5582764230",
                            "text": "Port Maintenance",
                            "selected": false
                        }
                    ]
                },
                "0706c561-e154-11e8-8851-0c4de9ce7b44": { //buildPermitReq
                    "options": [
                        {
                            "id": "f99e268a-61b5-44cf-ad83-fa6e54d2ee7c",
                            "text": "Is Required",
                            "selected": false
                        },
                        {
                            "id": "4278fad0-2f4f-4659-b9d0-e1bcb7ebbfa9",
                            "text": "Is Not Required",
                            "selected": false
                        },
                        {
                            "id": "a0c0fbc0-2a64-479b-8e70-71df6a049ab4",
                            "text": "To Be Determined",
                            "selected": false
                        }
                    ]
                },
                "07069c40-e154-11e8-9a63-0c4de9ce7b44": { //encroachPermitReq
                    "options": [
                        {
                            "id": "d9691774-e7de-4f56-bdbd-0463f40e6009",
                            "text": "Is Required",
                            "selected": false
                        },
                        {
                            "id": "17a72f49-0601-4bf8-b635-944f70f7fd51",
                            "text": "Is Not Required",
                            "selected": false
                        },
                        {
                            "id": "c20fbcf9-f255-4043-9983-53912cb7ba94",
                            "text": "To Be Determined",
                            "selected": false
                        }
                    ]
                },
                "ee19ef11-2022-11e9-827e-acde48001122": { //envSpecs
                    "options": [
                        {
                            "id": "dc86a6ee-d4da-4146-96e4-37ddc0faa921",
                            "text": "Heath - Safety",
                            "selected": false
                        },
                        {
                            "id": "86d8a204-c66c-47af-bd8b-2054a8d861f3",
                            "text": "Temporary Facilities Controls",
                            "selected": false
                        },
                        {
                            "id": "7f946740-bdd8-49b9-8db8-2816988284e5",
                            "text": "Environmental Mitigation Measures",
                            "selected": false
                        },
                        {
                            "id": "a9abb931-7ded-409f-96a1-d26769bf9432",
                            "text": "Temporary Erosion and Sediment Controls",
                            "selected": false
                        },
                        {
                            "id": "be458b6a-0d26-4fb7-beb9-c0366337deb7",
                            "text": "Excavated Materials Management",
                            "selected": false
                        },
                        {
                            "id": "37d019ec-d9dd-40ad-82b3-a2f875f07f6b",
                            "text": "None",
                            "selected": false
                        }
                    ]
                },
                "0cd9fbab-20e8-11e9-9ed6-acde48001122": { //mitigStatus
                    "options": [
                        {
                            "id": "0a3c1fe3-9435-4805-9f8b-93a3fb925b0a",
                            "text": "Uninitiated",
                            "selected": false
                        },
                        {
                            "id": "5dfbefe2-3097-4442-9248-41caaa6b9cec",
                            "text": "Initiated",
                            "selected": false
                        },
                        {
                            "id": "fe31157c-68f4-4588-a209-ee3ea40657f0",
                            "text": "Complete",
                            "selected": false
                        }
                    ]
                }
            };

            var mitigCount, completeMitigCount, pendingMitigCount, durationOfPendingMitigs;
            // mitigCount = 0, completeMitigCount = 0, pendingMitigCount = 0, durationOfPendingMitigs = "n/a";

            function retrieve(hit, nodeId, portArr) {
                if(!portArr) {
                    portArr = 0;
                }
                var res = "none", options = null, nodeStatus = null, multiSelect = false;
                hit._source.tiles.forEach(function(tile) {
                    if (nodeDict.staffType in tile.data) {
                        if (tile.data[nodeDict.staffType].indexOf(nodeId) >= 0) {
                            if (res == "none") {
                                res = (tile.data[nodeDict.staffName]);
                            } else {
                                res += (", "+tile.data[nodeDict.staffName]);
                            }
                        }
                    } else if((nodeId === nodeDict.facilities)  && (tile.data[nodeId])) {
                        if(tile.data[nodeId].length > 0) {
                            for (var j=0, k=0; k < tile.data[nodeId].length, j < portArr.length; j++) {
                                if( portArr[j].id == tile.data[nodeId][k] ) {
                                    if( res === "none") {
                                        res = ( portArr[j].text );
                                    } else {
                                        res += ", "+ portArr[j].text;
                                    }
                                    k++; j=0;
                                }
                            }
                        }
                    } else if((nodeId === nodeDict.contractNumber) && (tile.data[nodeId])) {
                        if( res === "none") {
                            res = ( tile.data[nodeId] );
                        } else {
                            res += ", "+ tile.data[nodeId];
                        }
                    } else { //run logic for other data types
                        if(nodeId in tile.data) {
                            switch(nodeId) {
                                case nodeDict.designStatus:
                                    nodeStatus = nodeId;
                                    break;
                                case nodeDict.envSpecs:
                                    nodeStatus = nodeId;
                                    multiSelect = true;
                                    break;
                                case nodeDict.buildPermitNumber:
                                    nodeStatus = nodeDict.buildPermitReq;
                                    break;
                                case nodeDict.encroachPermitNumber:
                                    nodeStatus = nodeDict.encroachPermitReq;
                                    break;
                                case nodeDict.constStatus:
                                    nodeStatus = nodeId;
                                    break;
                                default:
                                    break;
                            }
                            if(configObjDict[nodeStatus]) {
                                options = true;
                            }
                            if(options && (!tile.data[nodeId] || nodeId === nodeStatus)) {
                                res = optionSelect(tile, nodeStatus, configObjDict[nodeStatus], multiSelect);
                            } else {
                                res = tile.data[nodeId];
                            }
                        }
                    }
                });
                // console.log(res);
                return res;
            }

            function getMitigData(hit) {
                hit._source.tiles.forEach(function(tile) {
                    if(nodeDict.mitigName in tile.data) { //only in mitig tile, not mitigApplied tile
                        mitigCount+=1;
                    } else if(nodeDict.mitigStatus in tile.data) { //only in mitigApplied tile, not mitig tile
                        if(optionSelect(tile, nodeDict.mitigStatus, configObjDict[nodeDict.mitigStatus], false) === "Initiated") {
                            pendingMitigCount+=1;
                            if(tile.data[nodeDict.mitigEndDate]) {
                                if(durationOfPendingMitigs!== "n/a") {
                                    if(tile.data[nodeDict.mitigEndDate > durationOfPendingMitigs]) {
                                        durationOfPendingMitigs = tile.data[nodeDict.mitigEndDate];
                                    }
                                }
                                durationOfPendingMitigs = tile.data[nodeDict.mitigEndDate];
                            }
                        } else if(optionSelect(tile, nodeDict.mitigStatus, configObjDict[nodeDict.mitigStatus], false) === "Complete") {
                            completeMitigCount+=1;
                        }
                    }
                });
            }

            this.dataReady = ko.observable(false);
            getPorts().then( function(portArr) {
                ports = portArr;
                self.dataReady(true);
            });
            this.columnVis = [
                ko.observable(true),
                ko.observable(true),
                ko.observable(true),
                ko.observable(true),
                ko.observable(true),
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
                ajax: {
                    url: arches.urls.search_results,
                    data: queryStringFilters(),
                    dataSrc: function (data) {
                        var results = [];
                        data.results.hits.hits.forEach( function (hit) {
                            // mitigCount = 0, completeMitigCount = 0, pendingMitigCount = 0, durationOfPendingMitigs = "n/a";
                            // getMitigData(hit);
                            var description = hit._source.displaydescription.length > 100 ?
                                hit._source.displaydescription.substring(0,100) + " ... </p>":
                                hit._source.displaydescription;
                            results.push([
                                $('<h4></h4>').text(hit._source.displayname)[0].outerHTML +
                                $('<div>' + description + '</div>')[0].outerHTML,
                                $('<p></p>').text(
                                    retrieve(hit, nodeDict.facilities, ports)
                                    )[0].outerHTML,
                                $('<p></p>').text(
                                    retrieve(hit, nodeDict.contractNumber)
                                    )[0].outerHTML,
                                $('<p></p>').text(
                                    retrieve(hit, nodeDict.projectEngineer)
                                    )[0].outerHTML,
                                $('<p></p>').text(
                                    retrieve(hit, nodeDict.projectManager)
                                    )[0].outerHTML,
                                $('<p></p>').text(
                                    retrieve(hit, nodeDict.designStatus)
                                    )[0].outerHTML,
                                $('<p></p>').text(
                                    retrieve(hit, nodeDict.constStatus)
                                    )[0].outerHTML,
                                $('<p></p>').text(
                                    retrieve(hit, nodeDict.buildPermitNumber)
                                    )[0].outerHTML,
                                $('<p></p>').text(
                                    retrieve(hit, nodeDict.encroachPermitNumber)
                                    )[0].outerHTML,
                                $('<p></p>').text(
                                    retrieve(hit, nodeDict.envSpecs)
                                    )[0].outerHTML,
                                $('<h4></h4>').text(
                                    retrieve(hit, nodeDict.envApprovedBy)
                                )[0].outerHTML + $('<div>' + retrieve(hit, nodeDict.envApprovedDate) + '</div>')[0].outerHTML,
                                $('<h4></h4>').text(
                                    retrieve(hit, nodeDict.planApprovedBy)
                                )[0].outerHTML + $('<div>' + retrieve(hit, nodeDict.planApprovedDate) + '</div>')[0].outerHTML,
                            ]);
                        });
                        return results;
                    }
                },
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
        template: { require: 'text!templates/views/components/plugins/dashboard.htm' }
    });
});
