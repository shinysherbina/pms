# Makefile for Django + Docker workflow
# Run Django shell
shell:
	docker-compose exec backend python manage.py shell

# Run migrations
migrate:
	docker-compose exec backend python manage.py migrate

# Make migrations
makemigrations:
	docker-compose exec backend python manage.py makemigrations core

# Seed the database
seed:
	docker-compose exec backend python manage.py seed --wipe

# Create superuser
createsuperuser:
	docker-compose exec backend python manage.py createsuperuser

# Open psql shell (via db container)
dbshell:
	docker-compose exec db psql -U postgres -d pms

# Show tables in psql
dbtables:
	docker-compose exec db psql -U postgres -d pms -c "\dt"

# Describe a table (pass TABLE=core_task)
describe:
	docker-compose exec db psql -U postgres -d pms -c "\d $(TABLE)"

help:
	@echo "Available targets:"
	@grep -E '^[a-zA-Z_-]+:' Makefile | grep -vE '^_' | awk -F: '{print "  - " $$1}'

reset:
	docker-compose exec backend python manage.py flush --noinput
	make seed

# Run custom SQL query (pass QUERY='SELECT * FROM core_task WHERE status=''done''')
query:
	@docker-compose exec db psql -U postgres -d pms -c "$(QUERY)"
