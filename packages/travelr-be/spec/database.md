# PostgreSQL

## セットアップ

1.  `yarn up` する。

1.  pgAdmin4 にログインし、「travelr」ユーザと「travelr」データベースを作成する。

    ```sql
    CREATE USER travelr PASSWORD '********';

    CREATE DATABASE travelr
    WITH TEMPLATE = template0
    OWNER = travelr
    ENCODING = 'UTF8'
    LC_COLLATE = 'ja_JP.UTF-8'
    LC_CTYPE = 'ja_JP.UTF-8';
    ```

    Role Attributes の詳細は[こちら](https://www.postgresql.org/docs/10/static/role-attributes.html)

1.  作成したデータベースにおいて、PostGIS 機能拡張を ON にする

    ```sql
    CREATE EXTENSION postgis;
    ```

1.  `queries`フォルダの所定のクエリを実行する。

## バックアップ

https://qiita.com/kame_hitoshi/items/0caca3615764fd566a1c

```powershell
# containerに入る
docker exec -it some-postgis /bin/bash

# バックアップ
pg_dump -U travelr travelr | gzip > /backup/dump.sql.gz

# リストア（事前にユーザとDBを手動で復元しておくこと）
gzip -cd dump.sql.gz | psql -U travelr -d travelr
```
