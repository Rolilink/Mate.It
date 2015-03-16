# Mate It 
FROM dockerfile/nodejs

#Update apt-get
RUN apt-get update

#Installing Nginx
RUN apt-get install -y nginx

#Setting temps to save config files
RUN mkdir /data/tmpconf
ADD ./nginx /data/tmpconf
RUN cp /data/tmpconf/default.production /etc/nginx/sites-available/default

#Installing Sails and Forever
RUN npm install -g sails && npm install -g forever

# Create App Directory and CD into it
RUN mkdir /data/app
WORKDIR /data/app

# Deploy API
ADD ./app/ /data/app/
WORKDIR /data/app/server
RUN rm /data/app/node_modules -Rvf
RUN npm install

# Build Front End
#WORKDIR /data/app/client
#RUN npm install && \
#    bower install && \
#    grunt build

# Run App
WORKDIR /data/app
EXPOSE 80

CMD bash init.sh
