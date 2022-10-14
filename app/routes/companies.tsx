import { fetch, json, redirect, type LoaderFunction } from '@remix-run/node';
import {
  Form,
  useLoaderData,
  useParams,
  useSearchParams,
} from '@remix-run/react';
import filter from 'lodash.filter';
import { z } from 'zod';
import Company from '~/companies/components/Company';
import type { CompanyLoaderData } from '~/companies/types';
import getCompanyFilters from '~/companies/utils/getCompanyFilters';
import type AwesomeRemoteJob from '~/types/AwesomeRemoteJob';

export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams, pathname } = new URL(request.url);
  const data: AwesomeRemoteJob[] = await fetch(
    'https://raw.githubusercontent.com/italiaremote/awesome-italia-remote/main/outputs.json'
  ).then((res) => res.json());

  try {
    const result = z
      .object({
        tag: z.string().optional(),
        remote_policy: z
          .enum(['Optional', 'Hybrid', 'Full', '-'])
          .transform((f) => (f === '-' ? undefined : f))
          .optional(),
        hiring_policy: z
          .enum(['Direct', 'Contract', 'Intermediary', '-'])
          .transform((f) => (f === '-' ? undefined : f))
          .optional(),
      })
      .or(z.null())
      .parse(Object.fromEntries(searchParams));

    const policiesFilter = getCompanyFilters(data);

    return json({
      filters: policiesFilter,
      data: filter(data, (job) => {
        // This is clearly a merdone 💩
        if (result) {
          return (
            (result.remote_policy
              ? job.remote_policy === result.remote_policy
              : true) &&
            job.hiring_policies.some((policy) =>
              result.hiring_policy ? policy === result.hiring_policy : true
            ) &&
            job.tags?.some((tag) =>
              result.tag
                ? tag.toLowerCase().includes(result.tag.toLowerCase())
                : true
            )
          );
        }

        return true;
      }),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return redirect(pathname);
    }

    throw new Response('Server Error', {
      status: 500,
    });
  }
};

export default function Index() {
  const data = useLoaderData<CompanyLoaderData>();
  const { policy } = useParams();
  const [params] = useSearchParams();

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <Form>
        <input defaultValue={params.get('tag') || ''} type="text" name="tag" />
        <select
          name="remote_policy"
          defaultValue={params.get('remote_policy') || ''}
        >
          {data.filters.remote.map((policy) => (
            <option key={policy} value={policy === '-' ? undefined : policy}>
              {policy === '-' ? 'all' : policy}
            </option>
          ))}
        </select>
        <select
          name="hiring_policy"
          defaultValue={params.get('hiring_policy') || ''}
        >
          {data.filters.hiring.map((policy) => (
            <option key={policy} value={policy === '-' ? undefined : policy}>
              {policy === '-' ? 'all' : policy}
            </option>
          ))}
        </select>
        <button type="submit">submit</button>
      </Form>
      <h1>Che ci sono in {policy || 'queste policy'}</h1>
      <ul>
        {data.data?.map((m) => (
          <li key={m.url}>
            <Company category={m.categories.join(',')} name={m.name} />
          </li>
        ))}
      </ul>
    </div>
  );
}
