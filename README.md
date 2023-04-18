linked
===

# Concept 😀
## document
- $ref: lazy end point

```shell
curl http://localhost:3000/hello
```
```json
{
  "name": "test",
  "address": {
    "$ref": "http://localhost:3000/hello/address"
  }
}
```
---
```shell
curl http://localhost:3000/hello/address
```
```json
{
  "host": "localhost",
  "port": 3000
}
```


## lintfetch
```typescript
client.get('/hello').then(console.log);
```
```json
{
  "name": "test",
  "address": {
    "$ref": "http://localhost:3000/hello/address"
  }
}
```

---
```typescript
const linked = await client.get('/hello');
// lazy load
const addr = linked.address;
// post submit 
addr.host = 'change localhost';
```
```json
{
  "name": "test",
  "address": {
    "$ref": "http://localhost:3000/hello/address"
  }
}
```
```json
{
  "host": "localhost",
  "port": 3000
}
```

