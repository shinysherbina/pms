# projects/types.py
import graphene

class ProjectStatusCounts(graphene.ObjectType):
    active = graphene.Int()
    completed = graphene.Int()
    on_hold = graphene.Int()

class TaskStatusCountsType(graphene.ObjectType):
    todo = graphene.Int()
    in_progress = graphene.Int()
    done = graphene.Int()