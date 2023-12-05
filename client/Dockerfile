FROM node:alpine

# The following env variables are set to fix these create-react-app issues:
# https://github.com/facebook/create-react-app/issues/8688
# https://github.com/facebook/create-react-app/issues/11779
ENV CI=true
ENV WDS_SOCKET_PORT=0

WORKDIR /app
COPY package.json ./
RUN npm install
COPY ./ ./

CMD ["npm", "start"]