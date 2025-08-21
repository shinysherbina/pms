# backend/projects/schema.py

import graphene
from graphene_django.types import DjangoObjectType
from projects.models import Project
from core.models import Organization
from tasks.models import Task  
from .types import ProjectStatusCounts, TaskStatusCounts


class ProjectType(DjangoObjectType):
    class Meta:
        model = Project
        fields = ("id", "name", "status", "description", "due_date", "organization")

    completed_tasks = graphene.Int()
    task_count = graphene.Int()

    def resolve_completed_tasks(self, info):
        return Task.objects.filter(project=self, status="done").count()

    def resolve_task_count(self, info):
        return Task.objects.filter(project=self).count()

class ProjectListQuery(graphene.ObjectType):
    projects = graphene.List(ProjectType, organization_id=graphene.Int(required=False))

    def resolve_projects(self, info, organization_id=None):
        if organization_id:
            return Project.objects.filter(organization_id=organization_id)
        return Project.objects.all()

class ProjectStatsQuery(graphene.ObjectType):
    organization_project_status_counts = graphene.Field(
        ProjectStatusCounts,
        organization_id=graphene.Int(required=True)
    )

    project_task_status_counts = graphene.Field(
        TaskStatusCounts,
        project_id=graphene.Int(required=True)
    )

    def resolve_organization_project_status_counts(self, info, organization_id):
        qs = Project.objects.filter(organization_id=organization_id)
        return ProjectStatusCounts(
            active=qs.filter(status="active").count(),
            completed=qs.filter(status="completed").count(),
            archived=qs.filter(status="archived").count()
        )

    def resolve_project_task_status_counts(self, info, project_id):
        qs = Task.objects.filter(project_id=project_id)
        return TaskStatusCounts(
            todo=qs.filter(status="todo").count(),
            in_progress=qs.filter(status="in_progress").count(),
            done=qs.filter(status="done").count()
        )
class CreateProject(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        status = graphene.String(required=False)
        description = graphene.String(required=False)
        due_date = graphene.types.datetime.Date(required=False)
        organization_id = graphene.Int(required=True)

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
        id = graphene.Int(required=True)
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

class ProjectQuery(ProjectListQuery, ProjectStatsQuery, graphene.ObjectType):
    pass

