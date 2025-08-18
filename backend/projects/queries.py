import graphene
from projects.models import Project
from .types import ProjectStatusCounts, TaskStatusCounts

class ProjectQuery(graphene.ObjectType):
    ...
    organization_project_status_counts = graphene.Field(
        ProjectStatusCounts,
        organization_id=graphene.ID(required=True)
    )

    def resolve_organization_project_status_counts(self, info, organization_id):
        qs = Project.objects.filter(organization_id=organization_id)
        return ProjectStatusCounts(
            active=qs.filter(status="ACTIVE").count(),
            completed=qs.filter(status="COMPLETED").count(),
            on_hold=qs.filter(status="ON_HOLD").count()
        )
    
    def resolve_project_task_status_counts(self, info, project_id):
        from tasks.models import Task
        qs = Task.objects.filter(project_id=project_id)
        return TaskStatusCounts(
            todo=qs.filter(status="TODO").count(),
            in_progress=qs.filter(status="IN_PROGRESS").count(),
            done=qs.filter(status="DONE").count()
        )
