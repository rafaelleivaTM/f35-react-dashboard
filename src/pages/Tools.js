import { Helmet } from "react-helmet-async";
// @mui
// components
// sections
import { Container, Grid } from "@mui/material";
import CreateMiraklSellerForm from "../sections/tools/AddMiraklSeller";
import ImportOrdersForm from "../sections/tools/ImportOrders";

// ---------------------------------------------------------------------

export default function ToolsPage() {
  return (
    <>
      <Helmet>
        <title> Tools </title>
      </Helmet>

      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <CreateMiraklSellerForm />
          </Grid>
          <Grid item xs={12} sm={6}>
            <ImportOrdersForm />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
