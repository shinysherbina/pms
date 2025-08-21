# backend/tasks/schema.py

import graphene
from graphene_django.types import DjangoObjectType
from tasks.models import Task, TaskComment

# ------------------ Types ------------------

class TaskType(DjangoObjectType):
    class Meta:
        model = Task
        fields = (
            "id", "title", "description", "status",
            "assignee_email", "project", "comments"
        )

class TaskCommentType(DjangoObjectType):
    class Meta:
        model = TaskComment
        fields = (
            "id", "content", "author_email", "task"
        )

# ------------------ Queries ------------------

class TaskListQuery(graphene.ObjectType):
    tasks = graphene.List(TaskType, project_id=graphene.Int())
    task = graphene.Field(TaskType, id=graphene.Int(required=True))
    task_comments = graphene.List(TaskCommentType)

    def resolve_tasks(root, info, project_id=None):
        if project_id:
            return Task.objects.filter(project_id=project_id)
        return Task.objects.all()
    
    def resolve_task(root, info, id):
        try:
            return Task.objects.get(pk=id)
        except Task.DoesNotExist:
            return None
        
    def resolve_task_comments(root, info):
        return TaskComment.objects.all()

class TaskCommentQuery(graphene.ObjectType):
    # task = graphene.Field(TaskType, id=graphene.Int(required=True))
    task_comment = graphene.List(TaskCommentType, task_id=graphene.Int(required=False))


    # def resolve_task(self, info, id):
    #     try:
    #         return Task.objects.get(pk=id)
    #     except Task.DoesNotExist:
    #         return None

    def resolve_task_comment(self, info, task_id):
        if task_id:
            return TaskComment.objects.filter(task_id=task_id)
        return TaskComment.objects.all()



# ------------------ Mutations ------------------

class CreateTask(graphene.Mutation):
    class Arguments:
        project_id = graphene.Int(required=True)
        title = graphene.String(required=True)
        description = graphene.String()
        status = graphene.String()
        assignee_email = graphene.String(required=True)

    task = graphene.Field(TaskType)

    def mutate(self, info, project_id, title, assignee_email, description="", status="todo"):
        task = Task.objects.create(
            project_id=project_id,
            title=title,
            description=description,
            status=status,
            assignee_email=assignee_email
        )
        return CreateTask(task=task)

class UpdateTask(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        title = graphene.String()
        description = graphene.String()
        status = graphene.String()
        assignee_email = graphene.String()

    task = graphene.Field(TaskType)

    def mutate(self, info, id, **kwargs):
        try:
            task = Task.objects.get(pk=id)
        except Task.DoesNotExist:
            raise Exception("Task not found")

        for attr, value in kwargs.items():
            setattr(task, attr, value)
        task.save()
        return UpdateTask(task=task)

class CreateTaskComment(graphene.Mutation):
    class Arguments:
        task_id = graphene.Int(required=True)
        content = graphene.String(required=True)
        author_email = graphene.String(required=True)

    comment = graphene.Field(TaskCommentType)

    def mutate(self, info, task_id, content, author_email):
        comment = TaskComment.objects.create(
            task_id=task_id,
            content=content,
            author_email=author_email
        )
        return CreateTaskComment(comment=comment)

class UpdateTaskComment(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        content = graphene.String()
        author_email = graphene.String()

    comment = graphene.Field(TaskCommentType)

    def mutate(self, info, id, **kwargs):
        try:
            comment = TaskComment.objects.get(pk=id)
        except TaskComment.DoesNotExist:
            raise Exception("Comment not found")

        for attr, value in kwargs.items():
            setattr(comment, attr, value)
        comment.save()
        return UpdateTaskComment(comment=comment)

# ------------------ Mutation Root ------------------

class TaskMutation(graphene.ObjectType):
    create_task = CreateTask.Field()
    update_task = UpdateTask.Field()
    create_task_comment = CreateTaskComment.Field()
    update_task_comment = UpdateTaskComment.Field()

class TaskQuery(TaskListQuery, TaskCommentQuery, graphene.ObjectType):
    pass