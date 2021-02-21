echo "Installing general dependencies..."
sudo apt-get update -y && sudo apt-get upgrade -y
sudo apt-get install -y git python3 python3-pip nginx
pip3 install virtualenv

echo "Installing python dependencies..."
python3 -m virtualenv led-box-backend/env
python3 -m pip install -r led-box-backend/requirements.txt

echo "Finished successfully!"
