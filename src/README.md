# Source boundaries

Quba memakai dependency direction berikut:

```text
app/routes → presentation → application → domain
                         ↑
                  infrastructure
```

- `app/` hanya menangani route composition dan navigation concern.
- `presentation/` merender state dan mengirim intent ke application contracts.
- `application/` mengorkestrasi use case, ports, transaction boundaries, dan typed outcomes.
- `domain/` berisi rule murni tanpa React, Expo, database, network, atau BLE.
- `infrastructure/` mengimplementasikan application ports dan menerjemahkan vendor errors.

Folder feature dibuat ketika use case pertama membutuhkannya. Jangan membuat shared `utils` atau barrel export luas.
