export interface ProcessId {
  processName: string;
  packageName: string;
  publisherNode: string;
}

export interface Address {
  node: string;
  process: ProcessId
}

export interface Request {
  inherit: boolean; // if true, this request inherits context AND payload of incipient request, and cannot have its own context.
  'expects-response': boolean; // if true, this request expects a response
  ipc?: string;
  metadata?: string;
  // to grab payload; use get_payload()
}

export type WrappedResponse = [
  {
    tag: 'ok';
    val: Response;
  } | {
    tag: 'error'; // network error
    val: string;
  },
  string | undefined,
]

export interface Response {
  ipc?: string;
  metadata?: string;
  // to grab payload; use get_payload()
}

export type Message = {
  tag: 'ok';
  val: [Address, Request | WrappedResponse];
} | {
  tag: 'error';
  val: string;
}

export type ResponseMessage = {
  tag: 'ok';
  val: [Address, WrappedResponse];
} | {
  tag: 'error';
  val: string;
}

