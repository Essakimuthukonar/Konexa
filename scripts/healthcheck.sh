#!/bin/bash

LOG_FILE="logs/health_check.log"

echo "===== Konexa Server Health Check =====" >> $LOG_FILE
echo "Date: $(date)" >> $LOG_FILE
echo "" >> $LOG_FILE

echo "Hostname:" >> $LOG_FILE
hostname >> $LOG_FILE

echo "" >> $LOG_FILE

echo "Uptime:" >> $LOG_FILE
uptime >> $LOG_FILE

echo "" >> $LOG_FILE

echo "CPU Usage:" >> $LOG_FILE
top -bn1 | grep "Cpu(s)" >> $LOG_FILE

echo "" >> $LOG_FILE

echo "Memory Usage:" >> $LOG_FILE
free -h >> $LOG_FILE

echo "" >> $LOG_FILE

echo "Disk Usage:" >> $LOG_FILE
df -h >> $LOG_FILE

echo "" >> $LOG_FILE

echo "Running Services:" >> $LOG_FILE
systemctl --type=service --state=running | head -10 >> $LOG_FILE

echo "=====================================" >> $LOG_FILE
echo "" >> $LOG_FILE
