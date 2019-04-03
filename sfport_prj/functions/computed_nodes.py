from arches.app.models import models
from arches.app.functions.base import BaseFunction
from django.db.models import Q

details = {
    'name': 'Computed Nodes',
    'type': 'node',
    'description': 'A function for computing nodes values from other nodes',
    'defaultconfig': {'triggering_nodegroups':['a4331c5e-19d6-11e9-a013-acde48001122']},
    'classname': 'ComputedNodes',
    'component': ''
}

class ComputedNodes(BaseFunction):

    def save(self, tile, request):
        self.tile = tile
        self.tiles = list(models.TileModel.objects.filter(Q(resourceinstance=tile.resourceinstance), ~Q(tileid=tile.tileid)))
        self.tiles.append(tile)

        totalFunds = self.calculateTotalFunds()
        encumbrances = self.calculateEncumbrances()
        balance = totalFunds - encumbrances

        self.updateNodeValueById('9b56e3ae-19d6-11e9-aac0-acde48001122', balance)
        self.updateNodeValueById('a1c028c2-19d6-11e9-ab55-acde48001122', encumbrances)

    def calculateTotalFunds(self):
        return self.sumByNodeId(
            # funding amount
            'a4332063-19d6-11e9-bdaf-acde48001122'
        )

    def calculateEncumbrances(self):
        return self.sumByNodeId(
            # change order amount
            'a5de75d9-19d6-11e9-9e07-acde48001122'
        ) + self.sumByNodeId(
            # contract amount
            'a5de70f8-19d6-11e9-ba47-acde48001122'
        )

    def sumByNodeId(self, nodeId):
        total = 0
        for tile in self.tiles:
            if nodeId in tile.data:
                value = tile.data[nodeId]
                if value:
                    total = total + float(value)
        return total

    def updateNodeValueById(self, nodeId, value):
        found = False
        for tile in self.tiles:
            if nodeId in tile.data:
                tile.data[nodeId] = value
                if tile.tileid != self.tile.tileid:
                    tile.save()
                found = True
                break
        if not found:
            raise Exception("node id not found!")
