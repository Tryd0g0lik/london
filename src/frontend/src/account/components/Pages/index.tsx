import { JSX, } from "react";
import { Navigate, createBrowserRouter, RouterProvider, } from 'react-router-dom';
import { RegistrationPageFC } from './RegistrerPage'
import { Pages } from '@Interfaces';
import { HomePageFC } from './HomePage';


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
]);


export function PagesFC(): JSX.Element {

  // const [htmlReact, useUseState] = useState();

  return < RouterProvider router={Router} />
}
