echo "Configure wsgi service..."
sudo cp led-box-backend/led_box_backend.service /etc/systemd/system/
sudo systemctl start led_box_backend
sudo systemctl enable led_box_backend
sudo systemctl status led_box_backend #Should print "active"

echo "Configure nginx..."
sudo cp setup/led_box_nginx.conf /etc/nginx/sites-available/
sudo rm /etc/nginx/sites-enabled/*
sudo ln -s /etc/nginx/sites-available/led_box_nginx.conf /etc/nginx/sites-enabled/
sudo nginx -t #Should print "ok"
sudo systemctl restart nginx

echo "Finished successfully!"