# projects/types.py
import graphene

class ProjectStatusCounts(graphene.ObjectType):
    active = graphene.Int()
    completed = graphene.Int()
    on_hold = graphene.Int()