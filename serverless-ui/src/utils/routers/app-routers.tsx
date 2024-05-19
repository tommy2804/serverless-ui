import { Routes, Route, Navigate, useParams, useLocation } from "react-router-dom";
import { lazy } from "react";
import Grid from "@mui/material/Grid";
import AppSuspense from "../../shared/suspense";
// import Sidebar from '../sidebar_navigation/Sidebar';
// import { SettingsPageProvider } from '../utils/context/settings-page-context';
// import NavigationComponent from '../shared/navigation-component/navigation-component';

const PageNotFound = lazy(() => import("../../pages/page-not-found"));
const Landing = lazy(() => import("../../pages/landing"));
const ChatApp = lazy(() => import("../../pages/chat"));
// const CurrentEvent = lazy(() => import('../pages/events-page/Event/current-event'));
// const Packages = lazy(() => import('../pages/packages'));
// const Transactions = lazy(() => import('../pages/transactions/transactions'));
// const Settings = lazy(() => import('../pages/settings'));

interface AppRoutersProps {
  prevUrl?: string;
}

const AppRouters = ({ prevUrl = "/" }: AppRoutersProps) => (
  <div className='app-routers-wrapper'>
    {/* <Sidebar /> */}
    <div className='app-routers-main'>
      {/* <NavigationComponent /> */}
      <Grid container className='container'>
        <Routes>
          <Route path='/sign-in' element={<Navigate to={prevUrl} />} />
          <Route path='/sign-up' element={<Navigate to={prevUrl} />} />
          <Route path='/change-password' element={<Navigate to={prevUrl} />} />
          <Route path='/verify-email' element={<Navigate to={prevUrl} />} />
          <Route path='/' element={<Navigate to='/landing' />} />
          <Route
            path='/landing'
            element={
              <AppSuspense>
                <Landing />
              </AppSuspense>
            }
          />
          <Route
            path='/chats'
            element={
              <AppSuspense>
                <ChatApp />
              </AppSuspense>
            }
          />

          {/* <Route
            path='/events/:nameUrl/:tab'
            element={
              <AppSuspense>
                <CurrentEvent />
              </AppSuspense>
            }
          /> */}
          <Route path='/settings' element={<Navigate to='/settings/profile' />} />
          {/* <Route
            path='/settings/:tab'
            element={
              <AppSuspense>
                <SettingsPageProvider>
                  <Settings />
                </SettingsPageProvider>
              </AppSuspense>
            }
          /> */}
          <Route
            path='/404'
            element={
              <AppSuspense>
                <PageNotFound />
              </AppSuspense>
            }
          />
          <Route path='*' element={<Navigate to='/404' replace={true} />} />
        </Routes>
      </Grid>
    </div>
  </div>
);

export default AppRouters;
