import graphene
from core.organization_schema import OrganizationQuery, OrganizationMutation
from projects.schema import ProjectQuery, ProjectMutation
from tasks.schema import TaskQuery, TaskMutation

class Query(ProjectQuery, TaskQuery, OrganizationQuery, graphene.ObjectType):
    pass

class Mutation(ProjectMutation, TaskMutation, OrganizationMutation, graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)
