import { default as printToTerminal } from "print-to-terminal";
import { default as getPayload } from "get-payload";
import { default as receive } from "receive";
import { default as sendRequest } from "send-request";
import { default as sendRequests } from "send-requests";
import { default as sendResponse } from "send-response";
import { default as sendAndAwaitResponse } from "send-and-await-response";
import { default as saveCapabilities } from "save-capabilities";

import { Message, Request, Response, Address } from "./types/uqbar";
import { httpBindingRequest } from "./utils/request";
import { httpResponse } from "./utils/response";

export function init(our: Address) {
  printToTerminal(0, `example: start`);

  const httpBindingsAddress: Address = {
    node: our.node,
    process: {
      processName: 'http_bindings',
      packageName: 'http_bindings',
      publisherNode: 'uqbar',
    }
  };

  const httpBindingsRequests = ['/example']
    .map(endpoint => httpBindingRequest(httpBindingsAddress, endpoint, 'example', true));
  sendRequests(httpBindingsRequests);

   while (true) {
    let awaitedMessage: Message = receive();
    if (awaitedMessage.tag !== "ok") {
      printToTerminal(0, "example: got network error");
      continue;
    }

    const [source, message] = awaitedMessage.val;
    printToTerminal(0, `example: got messageAndContext: ${JSON.stringify([source, message])}`);

    if ('expects-response' in message) {
      const ipc = message.ipc ? JSON.parse(message.ipc) : undefined;
      const payload = getPayload();

      if (ipc?.path) {
        // Payload has: "id" (null), "headers", "method", "path", "query_params", "raw_path", "url_params", "proxy_path"?
        switch (ipc.path) {
          case "/example":
            printToTerminal(1, `example: sending request`);
            const httpRequestJson = JSON.stringify({
              method: 'GET',
              uri: 'https://google.com',
              headers: {},
              body: '',
            });

            let response = sendAndAwaitResponse(
              { node: our.node, process: { name: "http_client" } },
              { inherit: false, 'expects-response': true, ipc: httpRequestJson },
              undefined,
            )

            printToTerminal(1, `example: got response: ${JSON.stringify(response)}`);

            httpResponse(200, { "Content-Type": "text/html" }, "<h1>example</h1>");
            break;
          default:
            httpResponse(404, { "Content-Type": "text/html" }, "Not Found");
        }
      }
    } else {
      // Handle incoming WS messages using get_payload()

      //   ws.on('message', async (message: WebSocket.RawData) => {
      //     console.log(message)
      //     let data: Operation | undefined = undefined
      //     try {
      //       data = JSON.parse(message.toString());
      //     } catch {
      //       console.error('!! could not parse message to json', message.toString())
      //     }
      //     if (!data?.type) return
      //     if (data.type === OperationType.QueryLLM) {
      //       console.log('II querying llm', JSON.stringify(data));
      //       this.queryLLM(ws, data.payload.conversation, data.payload.guid)
      //     } else if (data.type === OperationType.SpeakToNpc) {
      //       const npc = this.levels[this.activeLevel]?.npcs?.[data.payload.guid]
      //       await npc?.hear('Player', data.payload.message)
      //     } else {
      //       if (this.shouldPushOperation(data)) {
      //         console.log('II pushing operation', data);
      //         this.operationQueue.push(data)
      //       }
      //     }
      //   });
    }
  }
}
