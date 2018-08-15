# docker

## deploy

```sh
# new fasion
gcloud builds submit --tag asia.gcr.io/kubernetes-206923/travelr-api:1.2.0 .

# old fasion
docker build -t travelr . [--no-cache]
docker run --rm -it travelr /bin/sh
docker tag travelr asia.gcr.io/kubernetes-206923/travelr-api:1.0.6
docker push asia.gcr.io/kubernetes-206923/travelr-api:1.0.6
```
