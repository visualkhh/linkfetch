linked
===

# Concept 😀
## server
```typescript
class TestController {
  @Get('/hello')
  hello(@Query('name') name: string) {
    return `hello ${name}`;
  }
}
```

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



## client
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
client.get('/hello', {depth: 2}).then(console.log);
client.get('/hello', {path: ['/address']}).then(console.log);
```
```json
{
  "name": "test",
  "address": {
    "host": "localhost",
    "port": 3000
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

