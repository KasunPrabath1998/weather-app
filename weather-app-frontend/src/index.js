import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import './index.css';

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
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
);
