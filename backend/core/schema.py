import graphene
from projects.schema import ProjectQuery
from tasks.schema import TaskQuery

class Query(ProjectQuery, TaskQuery, graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query)
