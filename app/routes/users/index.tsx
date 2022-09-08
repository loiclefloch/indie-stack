import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { requireUser } from "~/session.server";
import PageContainer from "~/components/PageContainer";
import { getUsers } from "~/models/user.server";
import type { User } from "~/models/user.server";
import Link from '@mui/material/Link';

export async function loader({ request }: LoaderArgs) {
  await requireUser(request);

  const users = await getUsers(request);

  return json({
    users
  });
}

export const meta: MetaFunction = () => {
  return {
    title: "Users",
  };
};

function DashboardContent({ users } : { users: any }) {
  return (
    <>
      {users.map((user : User) => (
        <div key={user.id}>
          <Link href={`/users/${user.id}/show`}>
            {user.id} {user.email}
          </Link>
        </div>
      ))}
    </>
  );
}

export default function Dashboard() {
  const { users } = useLoaderData<typeof loader>();

  return (
    <PageContainer>
      <DashboardContent users={users} />
      <Outlet />
    </PageContainer>
  );
}
