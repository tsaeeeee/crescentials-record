module.exports = {
  apps: [
    {
      name: 'crescentials-record',
      script: './build/server/index.js',
      instances: 3, // Use 3 instances for 4-core system (leave 1 core for system)
      exec_mode: 'cluster',
      max_memory_restart: '512M', // Restart if memory usage exceeds 512MB
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      // Windows-specific optimizations
      autorestart: true,
      watch: false,
      max_restarts: 10,
      min_uptime: '10s',
    },
  ],
};