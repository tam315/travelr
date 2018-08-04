# Storage

## Folder

```txt
- original/{userId}/uuid.*** (write only for owners)
- sanitized/uuid.*** (cannot access)
- 1024w/uuid.*** (read only)
- 192w/uuid.*** (read only)
- 96w/uuid.*** (read only)
```

## Resize All Images

Run the folloing command on the `tool` container.

```sh
# download
gsutil -m cp -r gs://travelr-images/original/* . # /m multi-thread /r recursive

# upload
gsutil -m cp -r ./* gs://travelr-images/original/
```
