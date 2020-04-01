from datetime import datetime
from arches.app.models import models
from arches.app.functions.base import BaseFunction
from django.db.models import Q

details = {
    'name': 'Computed Nodes',
    'type': 'node',
    'description': 'A function for computing nodes values from other nodes',
    'defaultconfig': {'triggering_nodegroups': [
        'a4331c5e-19d6-11e9-a013-acde48001122',
        'a5de6cb5-19d6-11e9-811d-acde48001122',
        'a5de698c-19d6-11e9-8f40-acde48001122',
        '0cd9e70a-20e8-11e9-91d2-acde48001122'
    ]},
    'classname': 'ComputedNodes',
    'component': '',
    'functionid': '67d64ab7-22ec-4bf7-b8a5-513f911b2ba0'
}


class ComputedNodes(BaseFunction):

    def save(self, tile, request):
        self.tile = tile
        self.tiles = list(models.TileModel.objects.filter(Q(resourceinstance=tile.resourceinstance), ~Q(tileid=tile.tileid)))
        self.tiles.append(tile)

        if tile.nodegroup_id in ['a4331c5e-19d6-11e9-a013-acde48001122', 'a5de6cb5-19d6-11e9-811d-acde48001122', 'a5de698c-19d6-11e9-8f40-acde48001122']:
            self.contracts_nodegroup_id = 'a5de6cb5-19d6-11e9-811d-acde48001122'
            self.change_orders_nodegroup_id = 'a5de698c-19d6-11e9-8f40-acde48001122'

            self.contract_amount_node_id = 'a5de70f8-19d6-11e9-ba47-acde48001122'
            self.funding_amount_node_id = 'a4332063-19d6-11e9-bdaf-acde48001122'
            self.remaining_balance_node_id = '9b56e3ae-19d6-11e9-aac0-acde48001122'
            self.encumbrances_and_commitments_node_id = 'a1c028c2-19d6-11e9-ab55-acde48001122'
            self.contingency_calculated_node_id = 'a5de73d1-19d6-11e9-a50c-acde48001122'
            self.change_order_amount_node_id = 'a5de75d9-19d6-11e9-9e07-acde48001122'
            self.percentage_of_contingency_used_calculated_node_id = 'a5de7485-19d6-11e9-a898-acde48001122'

            total_funds = self.sum_by_node_id(self.funding_amount_node_id)
            encumbrances = self.sum_by_node_id(self.change_order_amount_node_id) + \
                self.sum_by_node_id(self.contract_amount_node_id)
            balance = total_funds - encumbrances

            self.update_node_value_by_id(self.remaining_balance_node_id, balance)
            self.update_node_value_by_id(self.encumbrances_and_commitments_node_id, encumbrances)

            for tile in self.get_tile_by_nodegroup_id(self.contracts_nodegroup_id):
                sum_of_change_orders = self.sum_by_node_id(self.change_order_amount_node_id, parenttile_id=tile.tileid)
                contingency = tile.data[self.contract_amount_node_id] * 0.1
                remaining_contingency_percentage = (contingency - sum_of_change_orders)/contingency

                tile.data[self.contingency_calculated_node_id] = contingency
                tile.data[self.percentage_of_contingency_used_calculated_node_id] = remaining_contingency_percentage

                if tile.tileid != self.tile.tileid:
                    tile.save()

        if tile.nodegroup_id == '0cd9e70a-20e8-11e9-91d2-acde48001122':
            self.applied_mitigations_node_id = '0cd9e70a-20e8-11e9-91d2-acde48001122'
            self.number_of_mitigation_node_id = '70883880-526e-11e9-83b1-acde48001122'
            self.number_of_pending_mitigations_node_id = 'aec5620a-526e-11e9-b901-acde48001122'
            self.number_of_completed_mitigations_node_id = '9ca7deb8-526e-11e9-a046-acde48001122'
            self.completion_date_of_pending_mitigations = 'ce7c5fe8-526e-11e9-8d3e-acde48001122'

            mitigations = self.get_tile_by_nodegroup_id(self.applied_mitigations_node_id)
            self.update_node_value_by_id(self.number_of_mitigation_node_id, len(mitigations))

            pending_mitigations = []
            for tile in mitigations:
                if tile.data['0cd9fbab-20e8-11e9-9ed6-acde48001122'] != 'fe31157c-68f4-4588-a209-ee3ea40657f0':
                    pending_mitigations.append(tile)
            self.update_node_value_by_id(self.number_of_pending_mitigations_node_id, len(pending_mitigations))
            self.update_node_value_by_id(self.number_of_completed_mitigations_node_id, len(mitigations) - len(pending_mitigations))

            date = None
            date_format = '%Y-%m-%d'
            for tile in pending_mitigations:
                if tile.data['0cda01b0-20e8-11e9-ab41-acde48001122'] is not None:
                    currentdate = datetime.strptime(tile.data['0cda01b0-20e8-11e9-ab41-acde48001122'], date_format).date()
                    if currentdate:
                        if date is None:
                            date = currentdate
                        else:
                            if date < currentdate:
                                date = currentdate

            val = date if date is None else str(date)
            self.update_node_value_by_id(self.completion_date_of_pending_mitigations, val)


    def sum_by_node_id(self, nodeId, parenttile_id=None):
        total = 0
        for tile in self.get_tile_by_node_id(nodeId, parenttile_id):
            value = tile.data[nodeId]
            if value:
                total = total + float(value)
        return total

    def update_node_value_by_id(self, nodeId, value):
        found = False
        for tile in self.get_tile_by_node_id(nodeId):
            tile.data[nodeId] = value
            if tile.tileid != self.tile.tileid:
                tile.save()
            found = True
            break
        if not found:
            raise Exception("node id not found!")

    def get_tile_by_node_id(self, nodeid, parenttile_id=None):
        tiles = []
        for tile in self.tiles:
            if nodeid in tile.data:
                if parenttile_id is None or (parenttile_id is not None and str(tile.parenttile_id) == str(parenttile_id)):
                    tiles.append(tile)
        return tiles

    def get_tile_by_nodegroup_id(self, nodegroup_id):
        tiles = []
        for tile in self.tiles:
            if str(tile.nodegroup_id) == nodegroup_id:
                tiles.append(tile)
        return tiles
