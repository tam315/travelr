# Kubernetes

## セットアップ手順メモ

tools フォルダを参照

## クラスタ構成

| name                | type                  | note                 |
| ------------------- | --------------------- | -------------------- |
| my-ingress          | ingress resource      | -                    |
| postgres-svc        | service               | type:NodePort        |
| pgadmin4-svc        | service               | type:NodePort        |
| postgres-dpl        | deployment            | -                    |
| pgadmin-dpl         | deployment            | -                    |
| pv-postgres         | PersistentVolume      | -                    |
| pv-pgadmin4         | PersistentVolume      | -                    |
| pvc-postgres        | PersistentVolumeClaim | -                    |
| pvc-pgadmin4        | PersistentVolumeClaim | -                    |
| pgadmin4-tls        | Certificate           | -                    |
| letsencrypt-staging | ClusterIssuer         | LetsEncrypt テスト用 |
| letsencrypt-prod    | ClusterIssuer         | LetsEncrypt 本番用   |

## Ingress

- Ingress Controller:
  - nginx-ingress-controller(35.189.155.237 を割り当て)
- 証明書管理:
  - cert-manager

## Deployment

postgres について、初期化に失敗する問題を解決するため、
データフォルダをデフォルトのサブフォルダに変更している。
詳細については deployment.yml のコメントを参照のこと。

## Persistent Disk

1.  kubernetes と同じゾーンに、下記の名称で手動でディスクを作成した。
    - disk-for-postgres
    - disk-for-pgadmin4
1.  各 Deployment に割り当てた。詳細は、deployment.yml の Deployment, PV, PVC の項目を参照のこと。

## バックアップ

データのバックアップは、定期的な pgdump およびディスクのスナップショットにより行う。
