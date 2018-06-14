# Kubernetes

## セットアップ手順メモ

tools フォルダを参照

## Ingress 関係

- nginx-ingress-controller
- cert-manager

## deployment / service

| name         | type             | expose   |
| ------------ | ---------------- | -------- |
| my-ingress   | ingress resource | -        |
| postgres-svc | service          | NodePort |
| pgadmin4-svc | service          | NodePort |
| postgres-dpl | deployment       | -        |
| pgadmin4-dpl | deployment       | -        |

postgres について、初期化に失敗する問題を解決するため、
データフォルダをデフォルトのサブフォルダに変更している。
詳細については deployment.yml のコメントを参照のこと。

## Static IP

下記を予約し、nginx-ingress-controller に割り当て
IP: 35.189.155.237

## Persistent Disk

1.  kubernetes と同じゾーンに、下記の名称で手動でディスクを作成した。
    - disk-for-postgres
    - disk-for-pgadmin4
1.  各 Deployment に割り当てた。詳細は、deployment.yml の Deployment, PV, PVC の項目を参照のこと。

## バックアップ

データのバックアップは、定期的な pgdump およびディスクのスナップショットにより行う。
