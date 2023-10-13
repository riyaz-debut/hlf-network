
First login to the server using credentials

and install the prerequisites given below to setup, run network on machine

  
  

## Check for updates

`sudo apt-get update`

*** This is use to keep all of packages up to date in Debian or a Debian-based Linux distribution.

  
  

## Install docker engine

`sudo apt install docker.io`

Use to install docker engine on system to manages all the containers.

  
  

## Install docker-compose service

`sudo apt install docker-compose`

Use this to install docker-compose tool (helps running docker ca,network files for organizations).

  
## Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

add exported config into ~/.profile file

## Install nodejs

`sudo apt install nodejs`

It will install nodejs on machine.

  
  

## Install npm

`sudo apt install npm`

It will install npm(node package manager) in machine to downloads node packages and their dependencies.

  
  

## Install json query langauge tool

`sudo apt install jq`

this will install jq tool in machine, used to transform JSON data into a more readable format and print it to the standard output on Linux.


## Install zip tool

`sudo apt install zip`

  
  

## Enable docker service

`sudo systemctl enable docker`

This command is used to enable docker service on machine

  
  
  

## Make user run docker commands without sudo

`sudo usermod -a -G docker ubuntu`

This is used to add user to docker group and granting permissions to run docker commands as normal user without using sudo.

After this ,just exit and re login to machine to take this into effect.

  
  
  

## Move to home directory

When logged into the machine again just type the following command to move into user home directory

`cd /home/ubuntu`

  
  

## Download fabric binaries

*** After moving to /home/ubuntu directory ,

download fabric binaries in home directory /var/home/ubuntu

using this command :-

`curl -sSL https://bit.ly/2ysbOFE | bash -s`

  
  

## Set fabric binaries path

Afetr downloading the fabric-binaries , add fabric-samples binaries folder path to /.profile file using command:-

  

sudo /bin/sh -c 'echo "

PATH="/home/ubuntu/fabric-samples/bin:$PATH"

" >> ~/.profile'

  

Next, refresh your profile by running the following command:

  

`source ~/.profile`

  
  

## Mounting Existing Volume

  

*** Detach volume from exisiting instance.

Attach the volume

  

ssh into new instance terminal

  

`command: lsblk`

  

> Output
> 
> xvda 202:0 0 8G 0 disk
> 
> ├─xvda1 202:1 0 7.9G 0 part /
> 
> ├─xvda14 202:14 0 4M 0 part
> 
> └─xvda15 202:15 0 106M 0 part /boot/efi
> 
> xvdb 202:16 0 8G 0 disk //This is the new disk

  

**xvdb is the additional volume which is not yet mounted**

-Now check the file system with 

    sudo file -s /dev/xvdb

It displays /dev/xvdb : data which means it doesn’t have a file system

- Format the disk 
sudo mkfs -t xfs /dev/xvdb
  

-Create a directory to add files in it

    sudo mkdir -p /hlf-volume

-Now mount the volume with newly created directory

    sudo mount /dev/xvdb /hlf-volume

-Volume is now successfully mounted. You can check with 

    df-h 

    lsblk


## Mounting new volume

Attaching new Volume

df -h 

lsblk
sudo file -s /dev/xvdb
sudo mkfs -t xfs /dev/xvdb
sudo file -s /dev/xvdb
sudo mkdir -p /hlf-volume
sudo mount /dev/xvdb /hlf-volume
sudo chown ubuntu:ubuntu -R /hlf-volume