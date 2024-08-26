import React from "react";
import { Navigate, createBrowserRouter, RouterProvider, } from 'react-router-dom';
import { RegistrationPageFC } from './RegistrerPage';
import { Pages } from '@Interfaces';
import { HomePageFC } from './HomePage';
import { ProfileFC } from './Profile';
import { ProfilePAsswordChangesFC } from './Profile/ProfileChanges';
import { AuthorizatorPageFC } from './AuthorizationPage';
import { ProfileRemoveFC } from './Remove/index';
import { ProfileAdsFC } from './Profile/Ads';
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
  },
  {
    path: Pages.Profile2,
    element: <ProfileFC />
  },
  {
    path: Pages.Delete,
    element: <ProfileRemoveFC />
  },
  {
    path: Pages.ProfilePassworChanges,
    element: <ProfilePAsswordChangesFC />
  },
  {
    path: Pages.Ads,
    element: <ProfileAdsFC />
  }


]);


export function PagesFC(): React.JSX.Element {

  // const [htmlReact, useUseState] = useState();

  return < RouterProvider router={Router} />
}
