import { Link } from "@remix-run/react";
import { json, LoaderArgs, MetaFunction, redirect } from "@remix-run/node";
import { requireUser } from "~/session.server";


// nothing yet on index redirect:
// - loggedout: to login page
// - loggedin: to dashboard
export async function loader({ request }: LoaderArgs) {
  await requireUser(request);

  return redirect("/dashboard")
  // return json({});
}

export const meta: MetaFunction = () => {
  return {
    title: "Backoffice",
  };
};

export default function Index() {
  return <main></main>;
}
