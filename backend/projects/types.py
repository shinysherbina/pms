import graphene

class ProjectStatusCounts(graphene.ObjectType):
    active = graphene.Int()
    completed = graphene.Int()
    archived = graphene.Int()

class TaskStatusCounts(graphene.ObjectType):  # 🔄 Renamed to match usage in queries.py
    todo = graphene.Int()
    in_progress = graphene.Int()
    done = graphene.Int()
