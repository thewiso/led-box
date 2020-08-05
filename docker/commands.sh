sudo docker build . --tag led-box:1.0
sudo docker run -p 80:80/tcp led-box:1.0 
sudo docker exec -it <mycontainer> bash

sudo docker images 
sudo rmi

sudo docker ps -a
sudo docker stop 

sudo docker system prune
