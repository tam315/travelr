# docker

## deploy

```sh
docker build -t travelr . [--no-cache]
docker run --rm -it travelr /bin/sh
docker tag travelr asia.gcr.io/kubernetes-206923/travelr-api:1.0.5
docker push asia.gcr.io/kubernetes-206923/travelr-api:1.0.5
```
