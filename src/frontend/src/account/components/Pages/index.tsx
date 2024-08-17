import React from "react";
import { Navigate, createBrowserRouter, RouterProvider, } from 'react-router-dom';
import { RegistrationPageFC } from './RegistrerPage';
import { Pages } from '@Interfaces';
import { HomePageFC } from './HomePage';
import { ProfileFC } from "./Profile";
import { AuthorizatorPageFC } from './AuthorizationPage'
// import { isElementOfType } from "react-dom/test-utils";

const Router = createBrowserRouter([
  {
    path: Pages.Home,
    element: <HomePageFC />
  },
  {
    path: Pages.Regisration,
    element: <RegistrationPageFC />
  },
  {
    path: Pages.Index,
    element: <Navigate to={Pages.Home} />
  },
  {
    path: Pages.InLogin,
    element: <AuthorizatorPageFC />
  },
  {
    path: Pages.Profile,
    element: <ProfileFC />
  }
]);


export function PagesFC(): React.JSX.Element {

  // const [htmlReact, useUseState] = useState();

  return < RouterProvider router={Router} />
}
