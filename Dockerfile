# Getting our node as Base image
FROM node:16.15.0

# Creating a new directory for app files and setting path in the container
RUN mkdir -p /usr/src/app
# Setting working directory in the container
WORKDIR /usr/src/app

# Copying the package.json file(contains dependencies) from project source dir to container dir
COPY . /usr/src/app
# Installing the dependencies into the container
RUN npm install

# Copying the source code of Application into the container dir
# COPY . /usr/src/app

# Container exposed network port number
EXPOSE 4001

# Command to run within the container
CMD ["npm", "start"]