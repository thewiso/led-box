echo "Installing general dependencies..."
sudo apt-get update && sudo apt-get upgrade
sudo apt-get install -y git python3 python3-pip nginx
pip3 install virtualenv

echo "Installing python dependencies..."
python3 -m virtualenv led-box-backend/env
source led-box-backend/env/bin/activate
pip3 install -r led-box-backend/requirements.txt
#optional:
#pip3 install connexion[swagger-ui]
deactivate

echo "Finished successfully!"
