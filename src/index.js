import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { GithubProvider } from "./context/context";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.render(
  <React.StrictMode>
    {/* authentication for connection */}
    <Auth0Provider
      domain="dev-chqw0q8t.eu.auth0.com"
      clientId="F8fUjV6Y9N9rWHQGBB9RuE8zzMDQOhGW"
      redirectUri={window.location.origin}
      cacheLocation="localstorage"
    >
      <GithubProvider>
        <App />
      </GithubProvider>
    </Auth0Provider>
    ,
  </React.StrictMode>,
  document.getElementById("root")
);

// (
//   <Auth0Provider
//     domain="dev-chqw0q8t.eu.auth0.com"
//     clientId="U3g4H1L98j5p9Zn8yIEbyQcZoJ5PDBZv"
//     redirectUri={window.location.origin}
//   >
//     <App />
//   </Auth0Provider>
// ),
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
