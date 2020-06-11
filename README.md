# Oil Booking System

# Routes
GET  /api/users/healthcheck - For Checking the Users endpoints health
POST /api/users/login - Login with the registered user and use the JWT token from response for other requests
POST /api/users/register - Register the user
GET  /api/pumps/healthcheck - For Checking the Pumps endpoints health
GET  /api/pumps/ - For listing all registered pumps
POST /api/pumps/ - For registering an Oil Pump
GET  /api/pumps/nearest - For fetching your nearest Oil Pump
POST /api/pumps/book - For booking fillings from the nearest pump
GET  /api/pumps/bookings/:pump_id - For listing Bookings of a Pump

To setup the project please follow these guidelines

1. Make sure that you have nodejs and npm installed in your system.
2. Run command 'npm install' in the project root directory to install all the dependencies from the package.json file.
3. Create a file .env in the project root directory and add these environments MONGO_URI, SECRET_OR_KEY, and PORT.
4. Place the MongoDB connection string in the MONGO_URI. You can refer to https://mlab.com/ which i have used.
5. SECRET_OR_KEY is the secret key for your password. Make sure this is strong enough to not get cracked easily.
6. PORT is the port on which you want to run the server. If this is not provided then application will run on default port 5000.
7. After setting up the .env file run 'npm run server' or 'npm start' in the root to run the nodemon server or normal server respectively.
8. Refer to this Postman collection for testing the endpoints https://www.getpostman.com/collections/910445649345042227db

Don't forget to Star and Fork the repository.

Have fun!


