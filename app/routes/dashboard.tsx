import type { LoaderArgs, MetaFunction } from "@remix-run/node";

import { prisma } from "~/db.server";
import { json, redirect } from "@remix-run/node";

import { requireUser } from "~/services/session.server";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import PageContainer from "~/components/layout/PageContainer";
import Chart from "~/components/dashboard/Chart";
import Deposits from "~/components/dashboard/Deposits";
import Orders from "~/components/dashboard/Orders";
import Crash from "~/components/dashboard/Crash";
import ErrorBoundary from "~/components/layout/ErrorBoundary"

export async function loader({ request }: LoaderArgs) {
  const user = await requireUser(request);
  return json({
    user
  });
}

export const meta: MetaFunction = () => {
  return {
    title: "Dashboard",
  };
};

function DashboardContent() {
  return (
    <Grid container spacing={3}>
      {/* Chart */}
      <Grid item xs={12} md={8} lg={9}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 240,
          }}
        >
          <Chart />
        </Paper>
      </Grid>
      {/* Recent Deposits */}
      <Grid item xs={12} md={4} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 240,
          }}
        >
          <Deposits />
        </Paper>
      </Grid>
      {/* Recent Orders */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <Orders />
        </Paper>
      </Grid>

      {/* Recent Orders */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
          <ErrorBoundary>
            <Crash />
          </ErrorBoundary>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default function Dashboard() {
  return <PageContainer><DashboardContent /></PageContainer>;
}
