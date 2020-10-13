# Address API

#### Start database in Docker
Start the MongoDB instance in a container.
```sh
npm run docker-start
```
#### Run tests
Run tests with test database.
```sh
npm test
```
#### Run API
Start the API and connect to production database.
```sh
npm start
```
#### API commands

*Create an address*
```sh
curl -d '{"name":"Steve", "street":"123 Apple Lane", "city": "Cupertino", "state":"CA", "country":"USA"}' -H "Content-type: application/json" -X POST http://localhost:8080/address
```

*Get an address by id*
(id: object id)
```sh
curl http://localhost:8080/address/:id
```

*Update an address*
(id: object id)
```sh
curl -d '{"name":"Steve", "street":"123 Apple Lane", "city": "Cupertino", "state":"CA", "country":"USA"}' -H "Content-type: application/json" -X PUT http://localhost:8080/address/:id
```

*Delete an address*
(id: object id)
```sh
curl -X DELETE http://localhost:8080/address/:id
```

*Get the list of addresses by {state | country}*
(country: 3 character ISO code, state: 2 character ISO code)
```sh
curl "http://localhost:8080/address?country=CTY&state=ST"
```

#### Stop Docker

Stop and remove the docker image after you finish testing.
```sh
npm run docker-stop
```
