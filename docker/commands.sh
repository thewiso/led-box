sudo docker build . --tag led-box:1.0

sudo docker images 
sudo rmi

sudo docker run -p 80:80/tcp led-box:1.0 

sudo docker ps -a
sudo docker system prune
sudo docker stop 

sudo docker exec -it <mycontainer> bash