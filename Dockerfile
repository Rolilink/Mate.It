# Mate It API
# Installs Forever
FROM dockerfile/nodejs

#Installing Sails and Forever
RUN npm install -g sails && npm install -g forever

# Create App Directory and CD into it
RUN mkdir /data/app
WORKDIR /data/app

# Deploy API
ADD ./app/ /data/app/
RUN npm install

# Build Front End
#WORKDIR /data/app/client
#RUN npm install && \
#    bower install && \
#    grunt build

# Run App
WORKDIR /data/app
EXPOSE 3000
CMD sails lift
