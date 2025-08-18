import graphene
from core.graphql import OrganizationQuery
from projects.schema import ProjectQuery, ProjectMutation
from tasks.schema import TaskQuery

class Query(ProjectQuery, TaskQuery, OrganizationQuery, graphene.ObjectType):
    pass

class Mutation(ProjectMutation, graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)
