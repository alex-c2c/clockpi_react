# Dependencies
1. Nodejs: `25.0.0`
2. NPM: `11.6.2`

# Getting Started

## Run Development build
``` bash
/usr/bin/npm run dev
```

## Run Production build
``` bash
/usr/bin/npm run build
/usr/bin/npm run start
```

# Setup systemctl daemon
1. Create a new file `/lib/systemd/system/clockpi_react.service`
```bash
[Unit]
Description=Clockpi React App
After=network.target

[Service]
WorkingDirectory=<path_to_clockpi_react>
ExecStart=/usr/bin/npm run start
ExecReload=/bin/kill -s HUP $MAINPID
KillMode=mixed
TimeoutStopSec=5
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```
2. Run
``` bash
sudo systemctl enable clockpi_react.service
sudo systemctl start clockpi_react.service
```
