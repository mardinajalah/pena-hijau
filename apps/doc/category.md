# Category Spac

## Create Category
Enpoin : POST /api/category

Request Header :
- X-API-TOKEN: token

Request Body :
```json
{
  "name": "Aksi clean - up"
}
```

Repons Body (success) :

```json
{
  "id": 1,
  "name": "Aksi clean - up"
}
```

Repons Body (failed) :

```json
{
  "message": "Unauthorized"
}
```
