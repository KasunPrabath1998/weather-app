

Fidenz Weather Application – Full Stack Assignment
Overview
This project is a full-stack web application that retrieves and displays weather information for multiple cities. It demonstrates:
•	Backend with Spring Boot, caching, and Auth0 authentication.
•	Frontend with React.js, responsive UI, and Auth0 integration.
•	Secure access to weather data using JWT tokens and multi-factor authentication.
________________________________________


Features
Backend (Spring Boot)
•	Fetches weather data from OpenWeatherMap API.
•	Exposes /api/weather endpoint with secured access.
•	Caching enabled: Weather data is cached for 5 minutes to reduce API calls.
•	Authentication & Authorization:
o	Uses Auth0 JWT tokens for securing endpoints.
o	Only authenticated users can access the /api/weather endpoint.
•	CORS configured for frontend access.
    Frontend (React.js)
•	Responsive UI to display weather information.
•	Weather cards display:
o	City Name
o	Weather Condition
o	Temperature (min, max, current)
o	Pressure, Humidity, Visibility, Wind, Sunrise, Sunset
•	Integration with Auth0 for login, logout, and access control.
•	Navigation between dashboard and city detail view.
________________________________________



Tech Stack
•	Backend: Java, Spring Boot, Spring Security, Spring Cache
•	Frontend: React.js, CSS, React Router
•	Authentication: Auth0, JWT Tokens
•	API: OpenWeatherMap API
•	Caching: Spring Simple Cache (ConcurrentMapCacheManager)
________________________________________


Setup Instructions
1️⃣ Backend Setup
    1.	Clone the repository:
    git clone <REPO_URL>
    cd backend
    2.	Configure environment variables in application.properties:
    spring.application.name=gg
    server.port=8090

    spring.cache.type=simple

    spring.security.oauth2.resourceserver.jwt.issuer-uri=https://dev-e0bqatp4k12ypv17.us.auth0.com
    spring.security.oauth2.resourceserver.jwt.audience=https://dev-e0bqatp4k12ypv17.us.auth0.com/api/v2/



    3.	Build and run the Spring Boot application:

        ./mvnw spring-boot:run
        •	Backend runs on http://localhost:8090.
        •	/api/weather is secured and requires a valid Auth0 JWT token.
    ________________________________________


2️⃣ Frontend Setup

    1.	Navigate to frontend folder:
    cd frontend
    npm install
    2.	Configure Auth0 environment in index.js:
    2. Configure Auth0 environment in `index.js`:

    ```javascript
    <Auth0Provider
        domain="dev-e0bqatp4k12ypv17.us.auth0.com"
        clientId="FDLfUxT48MMGxHx4pf9eadCmNdZZV719"
        authorizationParams={{
            redirect_uri: window.location.origin,
            audience: "https://dev-e0bqatp4k12ypv17.us.auth0.com/api/v2/"
        }}
    >
        <App />
    </Auth0Provider>
    ```
    3.	Start the React app:
    npm start
    •	Frontend runs on http://localhost:3000.
    •	Users must login via Auth0 to view weather data.
    ________________________________________

    Auth0 Test Account
    •	Email: careers@fidenz.com
    •	Password: Pass#fidenz
    MFA is enabled; check email for verification code when logging in.
    ________________________________________


    Project Structure
    backend/
    ├── src/main/java/org/example/gg/
    │   ├── config/           
    │   ├── model/            
    │   └── controller/      
    ├── resources/
    │   └── application.properties
    └── pom.xml


    frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── WeatherDashboard.jsx
    │   │   └── WeatherUI.jsx
    │   ├── App.jsx
    │   └── index.js
    ├── public/
    │   └── index.html
    └── package.json
    ________________________________________


    Usage
    1.	Start backend: ./mvnw spring-boot:run
    2.	Start frontend: npm start
    3.	Navigate to http://localhost:3000
    4.	Login with Auth0 account to access weather data.
    ________________________________________


    Caching
    •	Weather data is cached for 5 minutes using Spring’s simple cache.
    •	Reduces redundant requests to OpenWeatherMap API.
    ________________________________________


    References
    •	OpenWeatherMap API Documentation
    •	Auth0 React SDK
    •	JWT Tokens Introduction
    •	Spring Boot Security
    ________________________________________


