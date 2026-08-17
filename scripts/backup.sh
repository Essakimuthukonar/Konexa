 #!/bin/bash

# Backup folder
BACKUP_DIR="/home/ubuntu/Konexa/backups"

# S3 Bucket
S3_BUCKET="s3://konexa-backup-essakimuthu/backups"

# Create backup folder if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Current date and time
DATE=$(date +%Y-%m-%d_%H-%M-%S)

# Backup file name
BACKUP_FILE="$BACKUP_DIR/konexa_backup_$DATE.tar.gz"

# Change to home directory
cd /home/ubuntu

# Create backup
tar \
  --exclude="Konexa/backups" \
  --exclude="Konexa/.git" \
  --exclude="Konexa/frontend/node_modules" \
  -czf "$BACKUP_FILE" Konexa

echo "Backup completed successfully!"
echo "Backup saved in: $BACKUP_FILE"

# Upload backup to S3
aws s3 cp "$BACKUP_FILE" "$S3_BUCKET/"

echo "Backup uploaded to S3 successfully!"
