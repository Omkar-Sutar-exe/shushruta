# Client (Frontend)

## Purpose

The client-side application is the user interface for the OrganEase platform, built using React.js. It provides an interactive and responsive experience for different user roles, including administrators, super administrators, and general users (hospitals/individuals). The client handles user authentication, displays organ availability, facilitates organ requests, processes payments, and manages user-specific dashboards and profiles.

## Directory Structure

*   `public/`: Contains static assets like `index.html` and `style.css`.
*   `src/`:
    *   `components/`:
        *   `admin/`: Components specific to the administrator dashboard, including categories, dashboard, hospital details, layout, orders, partials (navbar, sidebar, footer), and products.
        *   `common/`: Shared components like `MapComponent.js`.
        *   `shop/`: Components for the general user interface, including authentication, user dashboard, home page, layout, order process, partials (cart modal, footer, navbar), product details, and wishlist.
        *   `superadmin/`: Components for the super administrator dashboard, including categories and requests.
    *   `hooks/`: Custom React hooks, such as `useNominatimAutocomplete.js`.
    *   `App.js`: The main application component.
    *   `index.js`: The entry point for the React application.
    *   `serviceWorker.js`: For progressive web app functionalities.

## Technologies Used

*   **React.js:** A JavaScript library for building user interfaces.
*   **React Router DOM:** For declarative routing in React applications.
*   **Axios:** Promise-based HTTP client for making API requests.
*   **Bootstrap:** A popular CSS framework for styling and responsive design.
*   **Leaflet & React-Leaflet:** For interactive maps to display location-based information.
*   **Moment.js:** For parsing, validating, manipulating, and formatting dates and times.
*   **Socket.IO Client:** For real-time, bidirectional communication with the server.
*   **Braintree Web Drop-in React:** Integration for secure payment processing.
*   **Nodemailer:** (Likely used for client-side email sending, though typically handled server-side, it's listed as a client dependency).
*   **Twilio:** (Likely used for client-side phone verification or notifications, though typically handled server-side, it's listed as a client dependency).
*   **@testing-library/jest-dom, @testing-library/react, @testing-library/user-event:** Testing utilities for React components.
*   **react-scripts:** Scripts for common development tasks like starting, building, and testing the React application.

## Setup and Running

Refer to the main `README.md` in the project root for overall installation and running instructions. Ensure the backend server is running before starting the client application.
