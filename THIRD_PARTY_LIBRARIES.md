# Third-Party Libraries and Frameworks Used in OrganEase

This document provides an overview of the external libraries and frameworks utilized in the OrganEase project, detailing their purpose and how they contribute to the application's functionality.

## Frontend (Client) Dependencies

These libraries are primarily used in the `client` directory for building the user interface and handling client-side logic.

*   **React.js (`react`, `react-dom`):** A declarative, efficient, and flexible JavaScript library for building user interfaces. It's the foundation of the OrganEase frontend, enabling component-based UI development.
*   **React Router DOM (`react-router-dom`):** Provides declarative routing for React applications, allowing for navigation between different views and managing URL synchronization.
*   **Axios (`axios`):** A promise-based HTTP client for the browser and Node.js. Used for making API requests from the frontend to the backend server.
*   **Bootstrap (`bootstrap`):** A popular open-source CSS framework directed at responsive, mobile-first front-end web development. It provides pre-built UI components and styling for a consistent look and feel.
*   **Leaflet (`leaflet`) & React-Leaflet (`react-leaflet`):** Leaflet is an open-source JavaScript library for mobile-friendly interactive maps. `react-leaflet` integrates Leaflet maps seamlessly into React applications, likely used for displaying hospital locations or organ transport routes.
*   **Moment.js (`moment`):** A lightweight JavaScript date library for parsing, validating, manipulating, and formatting dates. Used for handling and displaying time-related information.
*   **Socket.IO Client (`socket.io-client`):** The client-side library for Socket.IO, enabling real-time, bidirectional, and event-based communication between the browser and the server. This is crucial for instant updates and notifications.
*   **Braintree Web Drop-in React (`braintree-web-drop-in-react`):** Provides a pre-built UI for accepting payments via Braintree, simplifying the integration of payment gateways into the application.
*   **Nodemailer (`nodemailer`):** A module for Node.js applications to allow easy email sending. While primarily a server-side tool, its presence in client dependencies might indicate client-side email triggering or configuration.
*   **Twilio (`twilio`):** A communication platform for building SMS, voice, and video capabilities. In the client, it might be used for phone number verification or sending notifications to users.
*   **Testing Libraries (`@testing-library/jest-dom`, `@testing-library/react`, `@testing-library/user-event`):** A set of utilities for testing React components, focusing on testing user-facing behavior rather than implementation details.
*   **React Scripts (`react-scripts`):** A set of scripts used by Create React App for common development tasks like starting a development server, building for production, and running tests.

## Backend (Server) Dependencies

These libraries are used in the `server` directory for handling server-side logic, database interactions, and API functionalities.

*   **Node.js:** The JavaScript runtime environment that executes the server-side code.
*   **Express.js (`express`):** A fast, unopinionated, minimalist web framework for Node.js. It's used to build the RESTful APIs that the frontend consumes.
*   **MongoDB & Mongoose (`mongoose`):** MongoDB is a NoSQL document database used for storing application data. Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js, providing a schema-based solution to model application data.
*   **bcryptjs (`bcryptjs`):** A library for hashing passwords. It's used to securely store user passwords in the database.
*   **Braintree (`braintree`):** The official Braintree Node.js client library for interacting with the Braintree payment gateway on the server-side.
*   **Cloudinary (`cloudinary`):** A cloud-based image and video management service. Likely used for storing and serving images related to categories and products.
*   **Cookie Parser (`cookie-parser`):** A middleware for Express.js that parses cookies attached to the client request object.
*   **CORS (`cors`):** A middleware for Express.js to enable Cross-Origin Resource Sharing, allowing the frontend to make requests to the backend from a different origin.
*   **Crypto-js (`crypto-js`):** A library of cryptographic algorithms. Could be used for various encryption or hashing tasks beyond password storage.
*   **Dotenv (`dotenv`):** A zero-dependency module that loads environment variables from a `.env` file into `process.env`, used for managing sensitive configuration data.
*   **Express-fileupload (`express-fileupload`):** A middleware for Express.js that handles file uploads, making it easier to process files sent from the client.
*   **Fuse.js (`fuse.js`):** A lightweight fuzzy-search library. Potentially used for implementing search functionalities with typo tolerance.
*   **Geolib (`geolib`):** A library to calculate distance, convert coordinates, and other geographic measurements. Useful for location-based services, such as finding nearby hospitals or calculating transport distances.
*   **JSON Web Token (`jsonwebtoken`):** Used for implementing token-based authentication. It securely transmits information between parties as a JSON object.
*   **Libphonenumber-js (`libphonenumber-js`):** A JavaScript library for parsing, validating, and formatting phone numbers. Used for handling user phone numbers.
*   **Morgan (`morgan`):** An HTTP request logger middleware for Node.js. Used for logging incoming requests to the server, which is helpful for debugging and monitoring.
*   **Multer (`multer`):** A middleware for Express.js for handling `multipart/form-data`, primarily used for uploading files.
*   **Natural (`natural`):** A general natural language facility for Node.js. Could be used for processing organ descriptions, matching criteria, or other text-based analysis.
*   **Nodemailer (`nodemailer`):** For sending emails from the server, such as order confirmations, password resets, or notifications.
*   **Nodemon (`nodemon`):** A utility that monitors for changes in your Node.js application and automatically restarts the server, speeding up development.
*   **Socket.IO (`socket.io`):** The server-side library for Socket.IO, enabling real-time, bidirectional, and event-based communication with connected clients.
*   **Twilio (`twilio`):** The official Twilio Node.js helper library for sending SMS messages, making calls, and other communication services.

## Root Dependencies

These dependencies are listed in the root `package.json` and might be shared or used in a broader context.

*   **Leaflet (`leaflet`) & React-Leaflet (`react-leaflet`):** As mentioned above, these are for map functionalities. Their presence in the root `package.json` suggests they might be used in a way that transcends just the client, possibly for server-side rendering related to maps or shared map configurations.