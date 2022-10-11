import { fetch, json, type LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import type AwesomeRemoteJob from '~/types/AwesomeRemoteJob';

export const loader: LoaderFunction = async () => {
  const data: AwesomeRemoteJob[] = await fetch(
    'https://raw.githubusercontent.com/italiaremote/awesome-italia-remote/main/outputs.json'
  ).then((res) => res.json());
  return json(data);
};

export default function Index() {
  const data = useLoaderData<AwesomeRemoteJob[]>();
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <ul>
        {data.map((m) => (
          <li key={m.name}>{m.name}</li>
        ))}
      </ul>
    </div>
  );
}
