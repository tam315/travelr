# Kubernetes

## セットアップ手順メモ

1.  cluster の作成
1.  kubectl の設定

    ```
    gcloud container clusters get-credentials cluster-1 --zone asia-northeast1-a --project ******
    ```

1.  secret の作成とアップロード
1.  deploy

    ```
    kubectl create -f .\kubernetes\spec\deployment.yml
    ```

## 構成

| name         | type       | expose                              |
| ------------ | ---------- | ----------------------------------- |
| my-ingress   | ingress    | Ingress 標準の Load Balancer による |
| postgres-svc | service    | NodePort                            |
| pgadmin4-svc | service    | NodePort                            |
| postgres-dpl | deployment | -                                   |
| pgadmin4-dpl | deployment | -                                   |

postgres について、初期化に失敗する問題を解決するため、
データフォルダをデフォルトのサブフォルダに変更している。
詳細については deployment.yml のコメントを参照のこと。

## Static IP

Ingress 用に下記を予約済み
name: ip-ingress
IP: 35.227.233.102

# Ingress / TLS

tool プロジェクトの notes を参照

## Persistent Disk

1.  kubernetes と同じゾーンに、下記の名称で手動でディスクを作成した。
    - disk-for-postgres
    - disk-for-pgadmin4
1.  各 Deployment に割り当てた。詳細は、deployment.yml の Deployment, PV, PVC の項目を参照のこと。

## バックアップ

データのバックアップは、定期的な pgdump およびディスクのスナップショットにより行う。
