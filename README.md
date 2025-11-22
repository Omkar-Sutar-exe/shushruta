# OrganEase

## Project Description

'OrganEase' is a web application designed to streamline the process of organ donation and transplantation. It addresses the critical need for efficient communication and data management in organ procurement and transplant centers. The existing manual methods are prone to errors and time-consuming, which can have severe consequences given the urgency of organ operations.

OrganEase aims to digitize and automate these processes, allowing procurement and transplant centers to display available organs and their details in real-time. Hospitals can then request organs with suitable compatibility (e.g., blood group) directly through the portal, make payments as a token of confirmation, and procurement centers can confirm these requests. This system significantly reduces the time and effort involved in organ allocation, ultimately saving lives.

## Features

*   **Real-time Organ Availability:** Procurement centers can display organs stored in hypothermic storages with their details.
*   **Streamlined Organ Request:** Hospitals can request organs with specific compatibility criteria.
*   **Payment Integration:** Secure payment processing for organ transfer confirmation.
*   **Request Confirmation:** Procurement centers can confirm organ requests through the portal.
*   **User Roles:** (Assumed based on folder structure: Admin, SuperAdmin, User/Shop)
    *   **Admin:** Manage categories, products, orders, and hospital details.
    *   **SuperAdmin:** Oversee requests and dashboard.
    *   **User/Shop:** Browse products, manage wishlists, view orders, and update profiles.

## Technologies Used

### Frontend (Client)

*   **React.js:** A JavaScript library for building user interfaces.
*   **React Router DOM:** For declarative routing in React applications.
*   **Axios:** Promise-based HTTP client for the browser and Node.js.
*   **Bootstrap:** A popular CSS framework for responsive and mobile-first front-end web development.
*   **Leaflet & React-Leaflet:** An open-source JavaScript library for mobile-friendly interactive maps, integrated with React.
*   **Moment.js:** A JavaScript date library for parsing, validating, manipulating, and formatting dates.
*   **Socket.IO Client:** For real-time, bidirectional event-based communication.
*   **Braintree Web Drop-in React:** For payment gateway integration.
*   **Nodemailer:** Module for Node.js applications to allow easy email sending.
*   **Twilio:** For SMS and voice communication (likely for phone verification or notifications).

### Backend (Server)

*   **Node.js:** JavaScript runtime built on Chrome's V8 JavaScript engine.
*   **Express.js:** A fast, unopinionated, minimalist web framework for Node.js.
*   **MongoDB:** A NoSQL document database.
*   **Mongoose:** MongoDB object data modeling (ODM) for Node.js.
*   **Leaflet & React-Leaflet:** (Also listed in root package.json, likely used for server-side map rendering or data processing related to location)

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js** (which includes npm)
*   **MongoDB cluster** created and its connection string added to your system's environment variables.

## Installation

To set up the project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd shushruta
    ```

2.  **Install client dependencies:**
    ```bash
    cd client
    npm install
    cd ..
    ```

3.  **Install server dependencies:**
    ```bash
    cd server
    npm install
    cd ..
    ```

## Running the Application

1.  **Start the server:**
    Open a terminal in the `server` directory and run:
    ```bash
    npm start:dev
    ```

2.  **Start the client:**
    Open another terminal in the `client` directory and run:
    ```bash
    npm start
    ```

3.  **Access the application:**
    Open your web browser and navigate to `http://localhost:3000/`.
