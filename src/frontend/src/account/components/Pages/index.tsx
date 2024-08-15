import React, { JSX } from "react";
import { useNavigate, createBrowserRouter, RouterProvider, RelativeRoutingType } from 'react-router-dom';
import { Pages } from '@Interfaces';
import { HomePageFC } from './HomePage';


const Router = createBrowserRouter([
  {
    path: Pages.Home,
    element: <HomePageFC />
  }
]);

export function PagesFC(): JSX.Element {
  return <></>
}
