# Docker

```bash

docker build   -t open-web-ui   -f Dockerfile   .

docker volume create open-webui

docker run -d   --name open-webui   -p 51022:8080   -v open-webui:/app/backend/data   --add-host host.docker.internal:host-gateway   --restart unless-stopped   open-web-ui:latest

docker logs -f open-webui

```


# Nginx Proxy

```conf

upstream rikiseisan_backend {
    # For now, same host
    server 127.0.0.1:51022;
    
    # For production, change to:
    # server backend-host.example.com:51022;
    # or
    # server 10.x.x.x:51022;
}

server {
    listen 80;
    server_name _;  # Change to your domain in production

    # Route /rikiseisan to the backend
    location /rikiseisan/ {
        # Strip /rikiseisan prefix before forwarding
        proxy_pass http://rikiseisan_backend;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Forward original headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Prefix /rikiseisan;
        
        # SSE (Server-Sent Events) support
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
        
        # Chunked transfer encoding
        chunked_transfer_encoding on;
        
        # Disable request buffering for streaming
        client_max_body_size 100M;
        proxy_request_buffering off;
    }
    
    # Health check endpoint (optional)
    location = /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}

```
