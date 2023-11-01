import { Helmet } from "react-helmet-async";
// @mui
// components
// sections
import { Container, Grid } from "@mui/material";
import CreateMiraklSellerForm from "../sections/tools/AddMiraklSeller";

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
        </Grid>
      </Container>
    </>
  );
}
