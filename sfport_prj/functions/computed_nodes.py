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
        'a5de698c-19d6-11e9-8f40-acde48001122'
    ]},
    'classname': 'ComputedNodes',
    'component': ''
}


class ComputedNodes(BaseFunction):

    def save(self, tile, request):
        self.tile = tile
        self.tiles = list(models.TileModel.objects.filter(Q(resourceinstance=tile.resourceinstance), ~Q(tileid=tile.tileid)))
        self.tiles.append(tile)

        self.contracts_nodegroup_id = 'a5de6cb5-19d6-11e9-811d-acde48001122'
        self.change_orders_nodegroup_id = 'a5de698c-19d6-11e9-8f40-acde48001122'

        self.contract_amount_node_id = 'a5de70f8-19d6-11e9-ba47-acde48001122'
        self.contingency_calculated_node_id = 'a5de73d1-19d6-11e9-a50c-acde48001122'

        #self.Change_Orders_Node = 'a5de6cb5-19d6-11e9-811d-acde48001122'
        self.change_order_amount_node_id = 'a5de75d9-19d6-11e9-9e07-acde48001122'
        self.percentage_of_contingency_used_calculated_node_id = 'a5de7485-19d6-11e9-a898-acde48001122'

        if tile.nodegroup_id == 'a4331c5e-19d6-11e9-a013-acde48001122':
            total_funds = self.calculate_total_funds()
            encumbrances = self.calculate_encumbrances()
            balance = total_funds - encumbrances

            self.update_node_value_by_id(
                # Remaining Balance (Calculated)
                '9b56e3ae-19d6-11e9-aac0-acde48001122', balance)

            self.update_node_value_by_id(
                # Encumbrances and Commitments (Calculated)
                'a1c028c2-19d6-11e9-ab55-acde48001122', encumbrances)

        if tile.nodegroup_id == self.contracts_nodegroup_id or tile.nodegroup_id == self.change_orders_nodegroup_id:
            for tile in self.get_tile_by_nodegroup_id(self.contracts_nodegroup_id):
                sum_of_change_orders = self.sum_by_node_id(self.change_order_amount_node_id, parenttile_id=tile.tileid)
                contingency = tile.data[self.contract_amount_node_id] * 0.1
                remaining_contingency_percentage = (contingency - sum_of_change_orders)/contingency

                tile.data[self.contingency_calculated_node_id] = contingency
                tile.data[self.percentage_of_contingency_used_calculated_node_id] = remaining_contingency_percentage

                if tile.tileid != self.tile.tileid:
                    tile.save()

    def calculate_total_funds(self):
        return self.sum_by_node_id(
            # funding amount
            'a4332063-19d6-11e9-bdaf-acde48001122'
        )

    def calculate_encumbrances(self):
        return self.sum_by_node_id(
            # change order amount
            'a5de75d9-19d6-11e9-9e07-acde48001122'
        ) + self.sum_by_node_id(self.contract_amount_node_id)

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
