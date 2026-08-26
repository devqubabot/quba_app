# Source boundaries

Quba uses the following dependency direction:

```text
app/routes → presentation → application → domain
                         ↑
                  infrastructure
```

- `app/` handles only route composition and navigation concerns.
- `presentation/` renders state and sends intent to application contracts.
- `application/` orchestrates use cases, ports, transaction boundaries, and typed outcomes.
- `domain/` contains pure rules without React, Expo, databases, networks, or BLE.
- `infrastructure/` implements application ports and translates vendor errors.

Create feature folders when the first use case requires them. Do not create a shared `utils` dumping ground or broad barrel exports.
