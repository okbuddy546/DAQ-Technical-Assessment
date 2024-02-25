import net from "net";
import { json } from "stream/consumers";
import { WebSocket, WebSocketServer } from "ws";

interface VehicleData {
  battery_temperature: number;
  timestamp: number;
}

const TCP_PORT = 12000;
const WS_PORT = 8080;
const tcpServer = net.createServer();
const websocketServer = new WebSocketServer({ port: WS_PORT });

let criticalTempTimestamps: number[] = [];

tcpServer.on("connection", (socket) => {
  console.log("TCP client connected");

  socket.on("data", (msg) => {
    console.log(`Received: ${msg.toString()}`);

    const dataString: String = msg.toString();
    // Checks if error flag is thrown in data which is indicated by "}}" at the end of string.
    if (dataString.slice(-2) !== "}}") {
      const jsonData: VehicleData = JSON.parse(msg.toString());
      const { battery_temperature, timestamp } = jsonData;
      
      if (battery_temperature <= 20 || battery_temperature >= 80) {
        criticalTempTimestamps.push(timestamp);

        criticalTempTimestamps = criticalTempTimestamps.filter(
          (timestamps) => timestamp - timestamps <= 5000
        );

        if (criticalTempTimestamps.length >= 3) {
          console.log(`Critical battery temperature detected. \nCurrent Timestamp: ${timestamp}`);
        }
      }

      // Send JSON over WS to frontend clients
      websocketServer.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(msg.toString());
        }
      });
    }

  });

  socket.on("end", () => {
    console.log("Closing connection with the TCP client");
  });

  socket.on("error", (err) => {
    console.log("TCP client error: ", err);
  });
});

websocketServer.on("listening", () =>
  console.log(`Websocket server started on port ${WS_PORT}`)
);

websocketServer.on("connection", async (ws: WebSocket) => {
  console.log("Frontend websocket client connected");
  ws.on("error", console.error);
});

tcpServer.listen(TCP_PORT, () => {
  console.log(`TCP server listening on port ${TCP_PORT}`);
});
