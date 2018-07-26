FROM node:8.11.3-alpine

# copy essential files
RUN mkdir /home/travelr-be
COPY package.json /home/travelr-be/
COPY yarn.lock /home/travelr-be/

# install packages
WORKDIR /home/travelr-be
RUN yarn --prod

# copy rest files
COPY src /home/travelr-be/src/
COPY config /home/travelr-be/config/

# install curl for kubernetes readiness prove
RUN apk add --no-cache curl

CMD ["yarn","start"]