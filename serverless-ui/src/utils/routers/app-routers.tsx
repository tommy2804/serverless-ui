import { Routes, Route, Navigate, useParams, useLocation } from "react-router-dom";
import { lazy } from "react";
// import Grid from '@mui/material/Grid';
// import Sidebar from '../sidebar_navigation/Sidebar';
// import IzmeSuspense from '../shared/suspense/izme-suspense';
// import { SettingsPageProvider } from '../utils/context/settings-page-context';
// import NavigationComponent from '../shared/navigation-component/navigation-component';

// const UsersPage = lazy(() => import('../pages/users-page'));
// const Events = lazy(() => import('../pages/events-page/events'));
// const CurrentEvent = lazy(() => import('../pages/events-page/Event/current-event'));
// const Packages = lazy(() => import('../pages/packages'));
// const PageNotFound = lazy(() => import('../pages/page-not-found/page-not-found'));
// const Transactions = lazy(() => import('../pages/transactions/transactions'));
// const Settings = lazy(() => import('../pages/settings'));

interface AppRoutersProps {
  prevUrl?: string;
}

const AppRouters = ({ prevUrl = "/" }: AppRoutersProps) => (
  <div className='app-routers-wrapper'>
    <div>hey thererererer</div>
    {/* <Sidebar />
    <div className="app-routers-main">
      <NavigationComponent />
      <Grid container className="container">
        <Routes>
          <Route path="/sign-in" element={<Navigate to={prevUrl} />} />
          <Route path="/sign-up" element={<Navigate to={prevUrl} />} />
          <Route path="/change-password" element={<Navigate to={prevUrl} />} />
          <Route path="/verify-email" element={<Navigate to={prevUrl} />} />
          <Route path="/" element={<Navigate to="/events" />} />
          <Route
            path="/events"
            element={
              <IzmeSuspense>
                <Events />
              </IzmeSuspense>
            }
          />
          <Route
            path="/users"
            element={
              <IzmeSuspense>
                <UsersPage />
              </IzmeSuspense>
            }
          />
          <Route
            path="/transactions"
            element={
              <IzmeSuspense>
                <Transactions />
              </IzmeSuspense>
            }
          />
          <Route
            path="/events/:nameUrl/:tab"
            element={
              <IzmeSuspense>
                <CurrentEvent />
              </IzmeSuspense>
            }
          />
          <Route path="/events/:nameUrl" element={<MiddleComp />} />
          <Route
            path="/packages"
            element={
              <IzmeSuspense>
                <Packages />
              </IzmeSuspense>
            }
          />
          <Route path="/settings" element={<Navigate to="/settings/profile" />} />
          <Route
            path="/settings/:tab"
            element={
              <IzmeSuspense>
                <SettingsPageProvider>
                  <Settings />
                </SettingsPageProvider>
              </IzmeSuspense>
            }
          />
          <Route
            path="/404"
            element={
              <IzmeSuspense>
                <PageNotFound />
              </IzmeSuspense>
            }
          />
          <Route path="*" element={<Navigate to="/404" replace={true} />} />
        </Routes>
      </Grid>
    </div> */}
  </div>
);

export default AppRouters;
