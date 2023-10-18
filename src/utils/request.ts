import { Address } from "../types/uqbar";

export const httpBindingRequest = (address: Address, app: string, path: string, authenticated: boolean) => [
  address,
  {
    inherit: false,
    expects_response: null,
    ipc: JSON.stringify({ "action": "bind-app", path, app, authenticated }),
    metadata: null,
  },
  null,
  null,
]
