import graphene

class TaskStatusCounts(graphene.ObjectType):
    todo = graphene.Int()
    in_progress = graphene.Int()
    done = graphene.Int()