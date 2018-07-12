# Update and Upgrade Packages
apt-get update
apt-get upgrade


# Git
apt-get install -y git

# NodeJS
apt-get install -y nodejs
apt-get install -y npm


# MongoDB
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/4.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.0.list
sudo apt-get update && sudo apt-get upgrade
sudo apt-get install -y mongodb-org
