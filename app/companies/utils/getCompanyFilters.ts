import type AwesomeRemoteJob from '~/types/AwesomeRemoteJob';

export default function getCompanyFilters(data: AwesomeRemoteJob[]) {
  const remote = [...new Set(data.map((company) => company.remote_policy))];
  const hiring = [
    ...new Set(data.map((company) => company.hiring_policies).flat()),
  ];

  return {
    remote,
    hiring,
  };
}
