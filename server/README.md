# Server (Backend)

## Purpose

The server-side application, named 'Sushruta', serves as the backend for the OrganEase platform. It handles all data management, business logic, API endpoints, and interactions with the MongoDB database. It is responsible for user authentication, managing categories, products (organs), orders, and hospital details, as well as facilitating payment processing and real-time communication.

## Directory Structure

*   `blockchain/`: Contains logic related to blockchain integration (e.g., `blockchain.js`).
*   `config/`: Configuration files for database connection, functions, keys, mailer, Nominatim (for location services), and upload folder creation.
*   `controller/`: Implements the business logic for various API endpoints, interacting with models and handling requests for admin, authentication, Braintree payments, categories, customization, orders, products, similarity (likely for organ matching), and users.
*   `middleware/`: Contains middleware functions, such as authentication checks.
*   `models/`: Defines the Mongoose schemas and models for categories, customization, orders, products, and users, representing the data structure in MongoDB.
*   `public/`: Stores static assets, primarily uploaded images for categories, customization, and products.
*   `routes/`: Defines the API routes for different functionalities, mapping URLs to controller functions.
*   `utils/`: Utility functions, such as `nlp.js` (likely for natural language processing related to organ descriptions or matching).
*   `server.js`: The main entry point of the server application.

## Technologies Used

*   **Node.js:** JavaScript runtime for executing server-side code.
*   **Express.js:** Web application framework for building robust APIs.
*   **MongoDB & Mongoose:** NoSQL database and its ODM for data storage and interaction.
*   **bcryptjs:** For hashing passwords securely.
*   **braintree:** Payment gateway integration.
*   **cloudinary:** Cloud-based image and video management.
*   **cookie-parser:** Middleware for parsing cookies.
*   **cors:** Middleware for enabling Cross-Origin Resource Sharing.
*   **crypto-js:** Cryptographic algorithms.
*   **dotenv:** Loads environment variables from a `.env` file.
*   **express-fileupload:** Middleware for uploading files.
*   **fuse.js:** Lightweight fuzzy-search library.
*   **geolib:** Library for geographic calculations.
*   **jsonwebtoken:** For creating and verifying JSON Web Tokens for authentication.
*   **leaflet & react-leaflet:** (Also listed in root package.json, likely used for server-side map rendering or data processing related to location)
*   **libphonenumber-js:** For parsing, validating, and formatting phone numbers.
*   **morgan:** HTTP request logger middleware.
*   **multer:** Middleware for handling `multipart/form-data`, primarily for file uploads.
*   **natural:** A general natural language facility for Node.js.
*   **nodemailer:** For sending emails.
*   **nodemon:** Utility that monitors for changes in your source and automatically restarts your server.
*   **socket.io:** For real-time, bidirectional event-based communication.
*   **twilio:** For SMS and voice communication.

## Setup and Running

Refer to the main `README.md` in the project root for overall installation and running instructions. Ensure that MongoDB is running and accessible, and environment variables (e.g., MongoDB connection string, API keys) are correctly configured.