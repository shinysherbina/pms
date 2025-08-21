from django.core.management.base import BaseCommand
from core.models import Organization
from projects.models import Project
from tasks.models import Task, TaskComment
from django.utils import timezone
from django.db import connection
import random

class Command(BaseCommand):
    help = "Seed the database with sample organizations, projects, tasks, and comments."

    def add_arguments(self, parser):
        parser.add_argument('--orgs', type=int, default=4, help='Number of organizations')
        parser.add_argument('--projects', type=int, default=5, help='Projects per organization')
        parser.add_argument('--tasks', type=int, default=5, help='Tasks per project')
        parser.add_argument('--wipe', action='store_true', help='Clear existing data before seeding')
        parser.add_argument('--timestamps', action='store_true', help='Add realistic timestamps')

    def reset_sequences(self):
        """Reset Postgres auto-increment sequences for predictable IDs."""
        with connection.cursor() as cursor:
            tables = ['core_organization', 'projects_project', 'tasks_task', 'tasks_taskcomment']
            for table in tables:
                cursor.execute(f"ALTER SEQUENCE {table}_id_seq RESTART WITH 1;")

    def handle(self, *args, **options):
        org_count = options['orgs']
        proj_count = options['projects']
        task_count = options['tasks']
        wipe = options['wipe']
        use_timestamps = options['timestamps']

        random.seed(42)  # Ensure reproducibility

        if wipe:
            self.stdout.write("🧹 Wiping existing data...")
            TaskComment.objects.all().delete()
            Task.objects.all().delete()
            Project.objects.all().delete()
            Organization.objects.all().delete()
            self.reset_sequences()

        self.stdout.write(f"🌱 Seeding {org_count} orgs × {proj_count} projects × {task_count} tasks...")

        for i in range(1, org_count + 1):
            org = Organization.objects.create(name=f"Org {i}")

            for j in range(1, proj_count + 1):
                proj = Project.objects.create(name=f"Project {j} of Org {i}", organization=org)

                tasks = []
                for k in range(1, task_count + 1):
                    created_at = timezone.now() - timezone.timedelta(days=random.randint(0, 30)) if use_timestamps else None
                    task = Task.objects.create(
                        title=f"Task {k} of Project {j} (Org {i})",
                        project=proj,
                        created_at=created_at if created_at else timezone.now()
                    )
                    tasks.append(task)

                for idx in range(min(4, len(tasks))):
                    TaskComment.objects.create(
                        task=tasks[idx],
                        content=f"Comment {idx+1} on {tasks[idx].title}"
                    )

        self.stdout.write(self.style.SUCCESS("✅ Seed complete."))
