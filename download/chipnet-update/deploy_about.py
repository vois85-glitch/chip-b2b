#!/usr/bin/env python3
"""
Deploy updated AboutCompany.tsx to chip-net.ru server.
"""

import paramiko
import sys

HOST = '45.155.52.105'
USER = 'root'
KEY = '/home/z/.ssh/id_ed25519'
REMOTE_BASE = '/var/www/chip-net'

def get_ssh():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, key_filename=KEY, timeout=15)
    return ssh

def write_remote_file(ssh, remote_path, content):
    sftp = ssh.open_sftp()
    with sftp.file(remote_path, 'w') as f:
        f.write(content)
    sftp.close()
    print(f'  ✓ Written: {remote_path}')

def run_cmd(ssh, cmd):
    print(f'  → {cmd}')
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=300)
    out = stdout.read().decode()
    err = stderr.read().decode()
    if out.strip():
        print(f'  {out.strip()}')
    if err.strip():
        print(f'  ERR: {err.strip()}')
    return out, err

def main():
    # Read the new AboutCompany.tsx
    with open('/home/z/my-project/download/chipnet-update/AboutCompany.tsx', 'r') as f:
        about_tsx = f.read()

    print('Connecting to server...')
    ssh = get_ssh()

    # 1. Upload the new AboutCompany.tsx
    print('\n--- Updating AboutCompany.tsx ---')
    write_remote_file(ssh, f'{REMOTE_BASE}/components/sections/AboutCompany.tsx', about_tsx)

    # 2. Build the project
    print('\n--- Building project ---')
    run_cmd(ssh, f'cd {REMOTE_BASE} && npm run build 2>&1')

    # 3. Restart PM2
    print('\n--- Restarting PM2 ---')
    run_cmd(ssh, 'pm2 restart chipnet')

    # 4. Verify
    print('\n--- Verifying ---')
    run_cmd(ssh, 'pm2 status chipnet')

    ssh.close()
    print('\n✅ Deployment complete!')

if __name__ == '__main__':
    main()
