## Build images

On the root folder that contains all the microservices, execute the command:
```bash
bash dockerBuildImages
```

Or run each of the following commands (positioned inside each folder):

docker build -t luiszunigacr/ms-posts .
docker build -t luiszunigacr/ms-comments .
docker build -t luiszunigacr/ms-query .
docker build -t luiszunigacr/ms-moderation .
docker build -t luiszunigacr/ms-event-bus .

## Restart  deployment
After updating a micro-service and building/pushing the image, restart the deployment like so:
```bash
kubectl rollout restart deployment [deployment-name]
```