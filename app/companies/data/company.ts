import { fetch } from '@remix-run/node';
import type AwesomeRemoteJob from '~/types/AwesomeRemoteJob';

export const getCompanies = () => {
  return fetch(
    'https://raw.githubusercontent.com/italiaremote/awesome-italia-remote/main/outputs.json'
  ).then<AwesomeRemoteJob[]>((res) => res.json());
};
