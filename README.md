### Reptile Tracker 
The Reptile Tracker app runs on 2 servers. Server in root, and client in frontend.


### Install the dependencies

With yarn
```bash
yarn
```

With npm
```bash
npm install
```

## Development
### .env
Copy the contents of `.env.example` into a new file called `.env`.

### Database
Create the database by running
```bash
yarn db:migrate
```

### Running the server
Client Side: Navigate within frontend directory before running.
Server Side: Stay within root directory. 

Start the server by running:

With yarn
```bash
yarn dev
```

With npm
```bash
npm run dev
```

Access the app through 
```
localhost:5173
```

## Production
Build the project by running

With yarn
```bash
yarn build
```

With npm
```bash
npm run build
```
