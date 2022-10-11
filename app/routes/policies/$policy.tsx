import { json, type LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import type AwesomeRemoteJob from '~/types/AwesomeRemoteJob';

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.policy, 'Expected params.policy');

  const { policy } = params;

  const data: AwesomeRemoteJob[] = await fetch(
    'https://raw.githubusercontent.com/italiaremote/awesome-italia-remote/main/outputs.json'
  ).then((res) => res.json());

  return json(
    data.filter((f) => f.remote_policy.toLowerCase() === policy.toLowerCase())
  );
};

export const Policy = () => {
  const data = useLoaderData<AwesomeRemoteJob[]>();

  return (
    <div>
      <ul>
        {data.map((m) => (
          <li key={m.name}>{m.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Policy;
