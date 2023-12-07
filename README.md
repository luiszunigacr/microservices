## Important notes
- The Ingress Nginx controller can be deployed locally using the following command (as stated at https://kubernetes.github.io/ingress-nginx/deploy/):
```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml
```

## Use of domain posts.com locally
Add the following line to the file /etc/hosts:
```shell
127.0.0.1 posts.com
```

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

## Skaffold
Skaffold is being used to automatically deploy into the local dev k8s cluster any changes made on the code. To start it, run the following command while positioned on the folder where the skaffold.yaml file is.
```bash
skaffold dev
```
The process will keep running and listening for changes, when you want to stop working on this project, just press Ctrl-C to kill the Skaffold process and it will delete all the deployments, services and other k8s objects that it manages.