import { Terminal } from "xterm";
import "xterm/css/xterm.css"; // DO NOT forget importing xterm.css

export class TerminalUI {
  constructor(socket) {
    this.terminal = new Terminal();

    /* You can make your terminals colorful :) */
    this.terminal.setOption("theme", {
      background: "#0B0B15",
      foreground: "#F5F8FA"
    });
    this.terminal.setOption("fontSize", 14);
    this.terminal.setOption("fontWeight", "400");
    this.terminal.setOption("fontFamily", "Courier Prime");

    this.socket = socket;
  }

  /**
   * Attach event listeners for terminal UI and socket.io client
   */
  startListening() {
    this.terminal.onData(data => this.sendInput(data));
    this.socket.on("output", data => {
      // When there is data from PTY on server, print that on Terminal.
      this.write(data);
    });
  }

  /**
   * Print something to terminal UI.
   */
  write(text) {
    this.terminal.write(text);
  }

  /**
   * Utility function to print new line on terminal.
   */
  prompt() {
    this.terminal.write(`\r\n$ `);
  }

  /**
   * Send whatever you type in Terminal UI to PTY process in server.
   * @param {*} input Input to send to server
   */
  sendInput(input) {
    this.socket.emit("input", input);
  }

  /**
   *
   * container is a HTMLElement where xterm can attach terminal ui instance.
   * div#terminal-container in this example.
   */
  attachTo(container) {
    this.terminal.open(container);
    //   this.terminal.fit()l
    // Default text to display on terminal.
    this.terminal.write("Terminal Connected");
    this.terminal.write("");
    this.prompt();
  }

  clear() {
    this.terminal.clear();
  }
}
