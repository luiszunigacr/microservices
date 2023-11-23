## Build images

docker build -t ms-posts .
docker build -t ms-comments .
docker build -t ms-query .
docker build -t ms-moderation .
docker build -t ms-event-bus .

## Run containers
docker run ms-posts
docker run ms-comments
docker run ms-query
docker run ms-moderation
docker run ms-event-bus
