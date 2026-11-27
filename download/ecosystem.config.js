module.exports = {
  apps: [{
    name: 'chipnet',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/chip-net',
    node_args: '--dns-result-order=ipv4first',
    env: {
      NODE_ENV: 'production',
    }
  }]
};
