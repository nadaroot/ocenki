#!/bin/bash
# =============================================================================
# Скрипт автоматического переноса и деплоя Backend API на сервер
# Сервер: 100.71.166.18 (Tailscale) / 192.168.1.80 (Local LAN)
# Пользователь: xinatory
# Порт SSH: 6767
# Пароль: 111qqq111
# =============================================================================

set -e

SERVER_USER="xinatory"
SERVER_PORT="6767"
SERVER_PASS="111qqq111"
REMOTE_DIR="/home/xinatory/electro-dnevnik-backend"

# Определение рабочего IP (Tailscale или локальный LAN)
if ping -c 1 -W 2 100.71.166.18 >/dev/null 2>&1; then
    SERVER_IP="100.71.166.18"
elif ping -c 1 -W 2 192.168.1.80 >/dev/null 2>&1; then
    SERVER_IP="192.168.1.80"
else
    SERVER_IP="100.71.166.18"
fi

echo "=== [1/4] Подготовка к деплою на сервер: $SERVER_USER@$SERVER_IP:$SERVER_PORT ==="

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

# Проверка сборки перед отправкой
echo "=== [2/4] Проверка сборки проекта ==="
npm run build

echo "=== [3/4] Упаковка и синхронизация файлов на сервер ==="

# Создание архива без node_modules и .git
ARCHIVE_PATH="/tmp/dnevnik-backend-deploy.tar.gz"
tar --exclude='node_modules' \
    --exclude='.git' \
    --exclude='.next/cache' \
    -czf "$ARCHIVE_PATH" .

echo "Архив сформирован: $ARCHIVE_PATH"

# Передача на сервер
echo "Передача архива на $SERVER_IP:$SERVER_PORT..."
python3 - <<EOF
import os, select, sys, time, pty

cmd = ['scp', '-P', '$SERVER_PORT', '-o', 'StrictHostKeyChecking=no', '$ARCHIVE_PATH', '$SERVER_USER@$SERVER_IP:/tmp/dnevnik-backend.tar.gz']
pid, fd = pty.fork()
if pid == 0:
    os.execvp('scp', cmd)
else:
    output = b''
    while True:
        r, _, _ = select.select([fd], [], [], 10)
        if not r:
            break
        data = os.read(fd, 1024)
        if not data:
            break
        output += data
        if b'password:' in output.lower():
            time.sleep(0.3)
            os.write(fd, b'$SERVER_PASS\n')
    os.close(fd)
    _, status = os.waitpid(pid, 0)
    if status != 0:
        print("Ошибка передачи по SCP. Статус:", status)
EOF

echo "=== [4/4] Запуск сервиса на сервере через Docker Compose ==="
python3 - <<EOF
import os, select, sys, time, pty

remote_cmd = (
    "mkdir -p $REMOTE_DIR && "
    "tar -xzf /tmp/dnevnik-backend.tar.gz -C $REMOTE_DIR && "
    "cd $REMOTE_DIR && "
    "docker compose down || true && "
    "docker compose up -d --build && "
    "echo 'Backend API успешно запущен!' && "
    "sleep 3 && "
    "curl -s http://localhost:3000/api/eschools/test || true"
)

cmd = ['ssh', '-p', '$SERVER_PORT', '-o', 'StrictHostKeyChecking=no', '$SERVER_USER@$SERVER_IP', remote_cmd]
pid, fd = pty.fork()
if pid == 0:
    os.execvp('ssh', cmd)
else:
    output = b''
    while True:
        r, _, _ = select.select([fd], [], [], 15)
        if not r:
            break
        data = os.read(fd, 1024)
        if not data:
            break
        output += data
        if b'password:' in output.lower():
            time.sleep(0.3)
            os.write(fd, b'$SERVER_PASS\n')
    os.close(fd)
    _, status = os.waitpid(pid, 0)
    print(output.decode('utf-8', errors='replace'))
EOF

echo "=== Деплой бэкенда завершен ==="
