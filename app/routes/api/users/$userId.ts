import { ActionArgs, json, } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node"; 

import { getUserById, updateUser } from "~/services/user.server";

// TODO: how to type the loader with the params?
type Params = {
	userId: string;
}

export const loader: LoaderFunction = async ({ params }) => {
	const user = await getUserById(params.userId as string)

  return json(user)
};

export async function action({ request, params }: ActionArgs) {
  const body = await request.formData();
  const user = await updateUser(params.userId as string, body);

  return json(user)
};