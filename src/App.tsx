import React from "react";
import "./App.scss";
import { privatesRoute, publicRoute, customRoute } from "./routers/router";
import PrivateRoute from "./routers/PrivateRoute";
import { Route, Routes } from "react-router-dom";
import CustomTemplate from "./templates/CustomTemplate";

function App() {
  return (
    <div className="app">
        <Routes>
          {privatesRoute?.map((route, index) => {
            let Page = route.component;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <PrivateRoute>
                    <Page />
                  </PrivateRoute>
                }
              />
            );
          })}
          {customRoute?.map((route, index) => {
            let Page = route.component;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <CustomTemplate>
                    <Page />
                  </CustomTemplate>
                }
              />
            );
          })}
          {publicRoute?.map((route, index) => {
            let Page = route.component;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                    <Page />
                }
              />
            );
          })}
        </Routes>
    </div>
  );
}

export default App;
