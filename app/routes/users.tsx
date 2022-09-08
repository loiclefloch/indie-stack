import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { requireUser } from "~/services/session.server";
import PageContainer from "~/components/layout/PageContainer";
import { getUsers } from "~/services/user.server";
import UsersTable from "~/components/users/UsersTable";


export async function loader({ request }: LoaderArgs) {
  await requireUser(request);

  const users = await getUsers();

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
    	<UsersTable users={users} />
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
