import { WebSocketServer } from "ws";
import { inspect } from "util";

interface MyWebSocket {
  destinationPlayground: boolean;
}

const wss = new WebSocketServer({ port: 8081 });
wss.on("connection", (ws) => {
  ws.on("error", console.error);

  ws.on("message", (rawData: Buffer) => {
    const dataString = rawData.toString();
    const data = JSON.parse(dataString);
    // console.log("received", inspect(data, { depth: 10 }));

    if (data.type === "connect" && data.context === "playground") {
      // Mark this client as a playground client. Always the last playground to connect.
      wss.clients.forEach(
        (client) =>
          ((client as unknown as MyWebSocket).destinationPlayground = false),
      );
      (ws as unknown as MyWebSocket).destinationPlayground = true;
    } else if (data.type === "updateBlock") {
      // Forward the updated block to the appropriate playground client
      wss.clients.forEach((client) => {
        if ((client as unknown as MyWebSocket).destinationPlayground) {
          client.send(dataString);
        }
      });
    }
  });
});
