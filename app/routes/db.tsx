import { type Company } from "@prisma/client";
import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/lib/db.server";

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

export default function DBTestPage() {
  let data = useLoaderData<LoaderData>();

  return <div>{JSON.stringify(data)}</div>;
}
