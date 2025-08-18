# core/management/commands/seed.py

from django.core.management.base import BaseCommand
from core.models import Organization, Project, Task, TaskComment
from django.utils import timezone
import random

class Command(BaseCommand):
    help = "Seed the database with sample organizations, projects, tasks, and comments."

    def add_arguments(self, parser):
        parser.add_argument('--orgs', type=int, default=4, help='Number of organizations')
        parser.add_argument('--projects', type=int, default=5, help='Projects per organization')
        parser.add_argument('--tasks', type=int, default=5, help='Tasks per project')
        parser.add_argument('--wipe', action='store_true', help='Clear existing data before seeding')

    def handle(self, *args, **options):
        org_count = options['orgs']
        proj_count = options['projects']
        task_count = options['tasks']
        wipe = options['wipe']

        if wipe:
            self.stdout.write("🧹 Wiping existing data...")
            TaskComment.objects.all().delete()
            Task.objects.all().delete()
            Project.objects.all().delete()
            Organization.objects.all().delete()

        self.stdout.write(f"🌱 Seeding {org_count} orgs × {proj_count} projects × {task_count} tasks...")

        for i in range(1, org_count + 1):
            org = Organization.objects.create(name=f"Org {i}")

            for j in range(1, proj_count + 1):
                proj = Project.objects.create(name=f"Project {j} of Org {i}", organization=org)

                tasks = []
                for k in range(1, task_count + 1):
                    task = Task.objects.create(
                        title=f"Task {k} of Project {j} (Org {i})",
                        project=proj
                    )
                    tasks.append(task)

                for idx in range(min(4, len(tasks))):
                    TaskComment.objects.create(
                        task=tasks[idx],
                        content=f"Comment {idx+1} on {tasks[idx].title}"
                    )

        self.stdout.write(self.style.SUCCESS("✅ Seed complete."))
