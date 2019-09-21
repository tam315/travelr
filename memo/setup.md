# memo

## how to run API server locally

```sh
cd packages/travelr-be
docker-compose up travelr_api
```

## how to deploy on the Cloud Run

```sh
cd packages/travelr-be
gcloud builds submit --project travelr-a75c4 --tag gcr.io/travelr-a75c4/travelr-api
gcloud beta run deploy --project travelr-a75c4 --image gcr.io/travelr-a75c4/travelr-api
```

### on GCP console:

- set env variables
  - NODE_ENV=production
  - and other variables in ~/github/my-secrets/travelr/docker-env-prod.txt
- enable Cloud SQL connections
- set DNS record
  - set CNAME of 'travelr-api.yuuniworks.com' to 'ghs.googlehosted.com' (follow instructions on console)
  - wait for about 10 min.
