# backend/tasks/models.py

from django.db import models
from projects.models import Project

# Optional: Reusable timestamp base class
class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Task(TimeStampedModel):
    STATUS_CHOICES = [
        ('todo', 'To Do'),
        ('in_progress', 'In Progress'),
        ('done', 'Done'),
    ]

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='tasks'
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='todo'
    )
    assignee_email = models.EmailField(blank=True)

    def __str__(self):
        project_name = self.project.name if self.project else "no-project"
        return f"{self.title} ({project_name})"


class TaskComment(TimeStampedModel):
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    content = models.TextField()
    author_email = models.EmailField(blank=True)

    def __str__(self):
        task_title = self.task.title if self.task else "no-task"
        author = self.author_email or "Unknown"
        return f"Comment by {author} on {task_title}"
