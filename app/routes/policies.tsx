import { fetch, json, type LoaderFunction } from '@remix-run/node';
import { Outlet, useLoaderData, useParams } from '@remix-run/react';
import type AwesomeRemoteJob from '~/types/AwesomeRemoteJob';

export const loader: LoaderFunction = async () => {
  const data: AwesomeRemoteJob[] = await fetch(
    'https://raw.githubusercontent.com/italiaremote/awesome-italia-remote/main/outputs.json'
  ).then((res) => res.json());

  const items = data.map((remote) => remote.remote_policy);
  return json([...new Set(items)].filter((f) => f !== '-'));
};

export default function Index() {
  const data = useLoaderData<string[]>();
  const { policy } = useParams();
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <ul>
        {data.map((m) => (
          <li key={m}>
            <a href={`/policies/${m.toLowerCase()}`}>{m}</a>
          </li>
        ))}
      </ul>
      <h1>Che ci sono in {policy || "queste policy"}</h1>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
