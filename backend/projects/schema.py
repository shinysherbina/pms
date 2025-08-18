# projects/schema.py
import graphene
from graphene_django.types import DjangoObjectType
from graphene import relay
from projects.models import Project
from core.models import Organization

class ProjectType(DjangoObjectType):
    class Meta:
        model = Project
        interfaces = (relay.Node,)
        fields = ("id", "name", "status", "description", "due_date", "organization")

class ProjectQuery(graphene.ObjectType):
    projects = graphene.List(ProjectType, organization_id=graphene.ID(required=False))

    def resolve_projects(self, info, organization_id=None):
        if organization_id:
            return Project.objects.filter(organization_id=organization_id)
        return Project.objects.all()

class CreateProject(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        status = graphene.String(required=False)
        description = graphene.String(required=False)
        due_date = graphene.types.datetime.Date(required=False)
        organization_id = graphene.ID(required=True)

    project = graphene.Field(ProjectType)

    def mutate(self, info, name, organization_id, status="active", description="", due_date=None):
        organization = Organization.objects.get(pk=organization_id)
        project = Project.objects.create(
            name=name,
            status=status,
            description=description,
            due_date=due_date,
            organization=organization
        )
        return CreateProject(project=project)

class UpdateProject(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        name = graphene.String()
        status = graphene.String()
        description = graphene.String()
        due_date = graphene.types.datetime.Date()

    project = graphene.Field(ProjectType)

    def mutate(self, info, id, **kwargs):
        project = Project.objects.get(pk=id)
        for key, value in kwargs.items():
            setattr(project, key, value)
        project.save()
        return UpdateProject(project=project)

class ProjectMutation(graphene.ObjectType):
    create_project = CreateProject.Field()
    update_project = UpdateProject.Field()
