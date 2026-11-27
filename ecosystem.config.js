module.exports = {
  apps: [{
    name: 'chip-net-blue',
    script: '/usr/bin/npm',
    args: 'start -- -p 3000 -H 127.0.0.1',
    cwd: '/var/www/chip-net',
    instances: 1,
    node_args: '--max-old-space-size=384',
    exec_mode: 'fork',
    // Prevent tight crash loops
    restart_delay: 5000,           // 5 second delay between restarts
    max_restarts: 10,              // max 10 restarts in restart_time window
    restart_time: 60000,           // within 60 seconds (then stop)
    autorestart: true,
    max_memory_restart: '512M',    // restart if memory exceeds 400MB
    // Logging
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    // Environment
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
