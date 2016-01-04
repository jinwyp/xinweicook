# https://gist.github.com/plentz/6737338
# read more here http://tautt.com/best-nginx-configuration-for-security/
# server_tokens off;
#add_header X-Frame-Options SAMEORIGIN;
#add_header X-Content-Type-Options nosniff;
#add_header X-XSS-Protection "1; mode=block";
#add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://ssl.google-analytics.com https://assets.zendesk.com https://connect.facebook.net; img-src 'self' https://ssl.google-analytics.com https://s-static.ak.facebook.com https://assets.zendesk.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://assets.zendesk.com; font-src 'self' https://themes.googleusercontent.com; frame-src https://assets.zendesk.com https://www.facebook.com https://s-static.ak.facebook.com https://tautt.zendesk.com; object-src 'none'";

server {
  listen 80;
  server_name db.xn--btrz41b.com;
  location / {
    proxy_hide_header X-Powered-By;
    proxy_hide_header X-Page-Speed;
    proxy_set_header X-Real-IP  $remote_addr;
    proxy_set_header  X-Client-IP     $remote_addr;
    proxy_set_header Host $host;
    proxy_set_header REMOTE-HOST $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass http://127.0.0.1:8081;
  }
}

server {
  listen 80;
  server_name 115.239.196.25 123.58.131.146 xn--btrz41b.com;
  location / {
    root /var/www/xn--btrz41b.com;
  }
  location /api {
    proxy_hide_header X-Powered-By;
    proxy_hide_header X-Page-Speed;
    proxy_set_header X-Real-IP  $remote_addr;
    proxy_set_header  X-Client-IP     $remote_addr;
    proxy_set_header Host $host;
    proxy_set_header REMOTE-HOST $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass http://10.4.40.91:3000/api;
  }
  location /api-test {
    proxy_hide_header X-Powered-By;
    proxy_hide_header X-Page-Speed;
    proxy_set_header X-Real-IP  $remote_addr;
    proxy_set_header  X-Client-IP     $remote_addr;
    proxy_set_header Host $host;
    proxy_set_header REMOTE-HOST $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass http://10.4.40.91:3000/api;
  }
}


server {
  listen 443 ssl spdy;
  server_name xn--btrz41b.com;
  keepalive_timeout   70;
  ssl_session_cache shared:SSL:50m;
  ssl_session_timeout 5m;
  ssl_prefer_server_ciphers on;
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
  ssl_ciphers "EECDH+ECDSA+AESGCM EECDH+aRSA+AESGCM EECDH+ECDSA+SHA384 EECDH+ECDSA+SHA256 EECDH+aRSA+SHA384 EECDH+aRSA+SHA256 EECDH+aRSA+RC4 EECDH RSA+AESGCM RSA+AES !RC4 !aNUL
L !eNULL !LOW !3DES !MD5 !EXP !PSK !SRP !DSS";
  ssl_certificate     /etc/nginx/ssl/xn--btrz41b.com.crt;
  ssl_certificate_key /etc/nginx/ssl/xn--btrz41b.com.key;
  ssl_dhparam /etc/nginx/ssl/xn--btrz41b.com.pem;
  resolver 223.5.5.5  223.6.6.6;
  ssl_stapling on;
  ssl_trusted_certificate /etc/nginx/ssl/xn--btrz41b.com.crt;
  # add_header Strict-Transport-Security "max-age=31536000; includeSubdomains;";
  location / {
    root /var/www/xn--btrz41b.com;
  }
  location /api {
    proxy_hide_header X-Powered-By;
    proxy_hide_header X-Page-Speed;
    proxy_set_header X-Real-IP  $remote_addr;
    proxy_set_header  X-Client-IP     $remote_addr;
    proxy_set_header Host $host;
    proxy_set_header REMOTE-HOST $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass http://127.0.0.1:3003/api;
  }
  location /api-test {
    proxy_hide_header X-Powered-By;
    proxy_hide_header X-Page-Speed;
    proxy_set_header X-Real-IP  $remote_addr;
    proxy_set_header  X-Client-IP     $remote_addr;
    proxy_set_header Host $host;
    proxy_set_header REMOTE-HOST $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass http://10.4.40.91:3000/api;
  }
}


server {
    listen 80;
    server_name www.xn--btrz41b.com;
    return 301 http://xn--btrz41b.com$request_uri;
}

server {
    listen 443;
    server_name www.xn--btrz41b.com;
    return 301 https://xn--btrz41b.com$request_uri;
}
