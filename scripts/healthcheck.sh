#!/bin/bash

echo "===== Konexa Health Check ====="

echo "Date: $(date)" | tee -a ../logs/health_check.log
echo "Hostname: $(hostname)"

echo
echo "System Uptime:"
uptime

echo
echo "Memory Usage:"
free -h

echo
echo "Disk Usage:"
df -h

echo
echo "CPU Usage:"
top -bn1 | grep "Cpu(s)"
