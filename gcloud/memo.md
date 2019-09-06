# memo about gcloud

- If the database user cannot be deleted:

```sh
gcloud deployment-manager deployments delete travelr-postgres --delete-policy=ABANDON
```
