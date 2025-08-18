#!/bin/bash
echo "Injecting custom pg_hba.conf..."
cp /postgres_conf/pg_hba.conf "$PGDATA/pg_hba.conf"
