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
import { useGetSchedulesGroupsAndMethodsMapQuery, useGetWarehouseMetaDataQuery } from "./redux/api/apiSlice";
import { updateF35SchedulesMetadata, updateWarehouseMetadata } from "./redux/appConfigSlice";

// ----------------------------------------------------------------------

export default function App() {
  const dispatch = useDispatch();
  const warehouseMetadata = useSelector((state) => state.appConfig.warehouseMetadata);
  const { data: warehouseMetadataResponse } = useGetWarehouseMetaDataQuery(undefined, {
    skip: warehouseMetadata.length > 0,
  });
  const f35SchedulesMetadata = useSelector((state) => state.appConfig.f35SchedulesMetadata);
  const { data: f35SchedulesMetadataResponse } = useGetSchedulesGroupsAndMethodsMapQuery(undefined, {
    skip: f35SchedulesMetadata.length > 0,
  });

  useEffect(() => {
    if (f35SchedulesMetadataResponse) {
      dispatch(updateF35SchedulesMetadata({ f35SchedulesMetadata: f35SchedulesMetadataResponse?.data }));
    }
  }, [f35SchedulesMetadataResponse, dispatch]);

  useEffect(() => {
    if (warehouseMetadataResponse) {
      dispatch(updateWarehouseMetadata({ warehouseMetadata: warehouseMetadataResponse?.data }));
    }
  }, [warehouseMetadataResponse, dispatch]);

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
