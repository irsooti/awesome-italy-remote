import { RemotePolicy, type Company } from "@prisma/client";
import {
  type ActionFunction,
  json,
  redirect,
  type LoaderFunction,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { db } from "~/lib/db.server";
import { z } from "zod";

type LoaderData = {
  companies: Company[];
};

export let loader: LoaderFunction = async () => {
  let companies = await db.company.findMany();
  let data: LoaderData = {
    companies,
  };
  return json(data);
};

export let action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();
  let formObject = Object.fromEntries(formData.entries());
  const formSchema = z.object({
    name: z.string().min(1),
    remotePolicy: z.enum([
      RemotePolicy.FULL,
      RemotePolicy.HYBRID,
      RemotePolicy.OPTIONAl,
    ]),
  });

  let data = formSchema.safeParse(formObject);

  if (!data.success) {
    return json({ error: data.error.flatten().fieldErrors });
  }

  await db.company.create({
    data: { name: data.data.name, remotePolicy: data.data.remotePolicy },
  });
  return redirect("/db");
};

export default function DBTestPage() {
  let data = useLoaderData<LoaderData>();
  let actionData = useActionData<
    z.typeToFlattenedError<
      {
        name: string;
        remotePolicy: "FULL" | "HYBRID" | "OPTIONAl";
      },
      string
    >
  >();

  return (
    <div>
      {JSON.stringify(data)}

      <Form method="post">
        <input type={"text"} name="name" />
        <select name="remotePolicy">
          {[RemotePolicy.FULL, RemotePolicy.HYBRID, RemotePolicy.OPTIONAl].map(
            (remotePolicy) => (
              <option key={remotePolicy} value={remotePolicy}>
                {remotePolicy}
              </option>
            )
          )}
        </select>
        <input type={"submit"} value="CREATE" />
      </Form>

      {JSON.stringify(actionData)}
    </div>
  );
}
