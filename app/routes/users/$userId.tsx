import * as React from "react";
import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getUserById } from "~/services/user.server";
import { useLoaderData } from "@remix-run/react";
import { Typography } from "@mui/material";
import RouteDrawer, { RouteDrawerCatchBoundary } from "~/components/layout/RouteDrawer";
import { notFound } from "~/utils/responses";

export async function loader({ params }) {
  const userId = params.userId;
  if (!userId) throw notFound("User not found")

  const user = await getUserById(userId as string);
  
  if (!user) throw notFound("User not found")

  return json({ user });
}

export function meta({ data }) {
  const { user } = data;

  return {
    title: `${user?.email}`,
  };
}

export default function User() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <RouteDrawer redirectTo="/users">
      <h3>User</h3>

      {!user && <Typography component="p">User not found</Typography>}

      <Typography component="p">
        {user.email} {user.firstName} {user.lastName}
      </Typography>
    </RouteDrawer>
  );
}

export function CatchBoundary() {
 return <RouteDrawerCatchBoundary redirectTo="/users" />
}
