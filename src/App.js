import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
// routes
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Router from "./routes";
// theme
import ThemeProvider from "./theme";
// components
import { StyledChart } from "./components/chart";
import ScrollToTop from "./components/scroll-to-top";
import { useGetSchedulesGroupsAndMethodsMapQuery } from "./redux/api/apiSlice";
import { updateF35SchedulesMetadata } from "./redux/appConfigSlice";

// ----------------------------------------------------------------------

export default function App() {
  const dispatch = useDispatch();
  const f35SchedulesMetadata = useSelector((state) => state.appConfig.f35SchedulesMetadata);
  const { f35SchedulesMetadataResponse } = useGetSchedulesGroupsAndMethodsMapQuery(undefined, {
    skip: f35SchedulesMetadata.length > 0,
  });

  useEffect(() => {
    if (f35SchedulesMetadataResponse) {
      dispatch(updateF35SchedulesMetadata({ f35SchedulesMetadata: f35SchedulesMetadataResponse?.data }));
    }
  }, [f35SchedulesMetadataResponse, dispatch]);

  useEffect(() => {
    // Request permission to show notifications
    Notification.requestPermission().then();
  }, []);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <ScrollToTop />
          <StyledChart />
          <Router />
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
