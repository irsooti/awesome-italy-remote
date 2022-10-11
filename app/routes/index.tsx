import {
  type ActionFunction,
  fetch,
  json,
  redirect,
  type LoaderFunction,
} from '@remix-run/node';
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from '@remix-run/react';
import type AwesomeRemoteJob from '~/types/AwesomeRemoteJob';

export const loader: LoaderFunction = async () => {
  const data: AwesomeRemoteJob[] = await fetch(
    'https://raw.githubusercontent.com/italiaremote/awesome-italia-remote/main/outputs.json'
  ).then((res) => res.json());
  return json(data);
};

export const action: ActionFunction = async ({ request, context, params }) => {
  if (request.method === 'POST') {
    const body = await request.formData();

    const result = await new Promise((resolve) => {
      setTimeout(() => {
        const firstName = body.get('firstName');
        const lastName = body.get('lastName');

        if (firstName && lastName) resolve(true);

        resolve(false);
      }, 5000);
    });

    if (result) {
      return redirect('/policies');
    } else {
      return json(
        {
          values: {
            firstName: body.get('firstName'),
            lastName: body.get('lastName'),
          },
          errors: {
            all: 'Something went wrong',
          },
        },
        400
      );
    }
  }
};

export default function Index() {
  const data = useLoaderData<AwesomeRemoteJob[]>();
  const actionData = useActionData();
  const transition = useTransition();

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <ul>
        {data.map((m) => (
          <li key={m.name}>{m.name}</li>
        ))}
      </ul>
      <div>
        <div>{actionData?.errors?.all}</div>
        <Form method="post">
          <input type="text" name="firstName" />
          <input type="text" name="lastName" />
          <button type="submit">
            {transition.state === 'submitting' ? 'Creating...' : 'Create'}
          </button>
        </Form>
      </div>
    </div>
  );
}
