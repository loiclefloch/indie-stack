import { json, } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node"; 

import { getUserById } from "~/services/user.server";

// TODO: how to type the loader with the params?
type Params = {
	userId: string;
}

export const loader: LoaderFunction = async ({ params }) => {
	const user = await getUserById(params.userId as string)

  return json(user)
};