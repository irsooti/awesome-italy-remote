import type AwesomeRemoteJob from '~/types/AwesomeRemoteJob';

export type CompanyFilters = {
  remote: string[];
  hiring: string[];
};

export type CompanyLoaderData = {
  filters: CompanyFilters;
  data: AwesomeRemoteJob[];
};
