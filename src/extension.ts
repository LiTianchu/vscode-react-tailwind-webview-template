// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { join } from "path";
import * as vscode from "vscode";
import { ExtensionContext, ExtensionMode, Uri, Webview } from "vscode";
import { MessageHandlerData } from "@estruyf/vscode";
import { readFileSync } from "fs";

export function activate(context: vscode.ExtensionContext) {

    const provider = new MySidebarViewProvider(context);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            "myExtension.customView",
            provider
        )
    );
}

// this method is called when your extension is deactivated
export function deactivate() { }


class MySidebarViewProvider implements vscode.WebviewViewProvider {
    private context: ExtensionContext;

    constructor(context: ExtensionContext) {
        this.context = context;
    }

    resolveWebviewView(
        webviewView: vscode.WebviewView,
        // Not used currently, comment out to avoid linting issues
        //resolveContext: vscode.WebviewViewResolveContext,
        //token: vscode.CancellationToken
    ) {
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this.context.extensionUri]
        };
        webviewView.webview.onDidReceiveMessage(
            (message) => {
                const { command, requestId, payload } = message;

                if (command === "GET_DATA") {
                    // Do something with the payload

                    // Send a response back to the webview
                    webviewView.webview.postMessage({
                        command,
                        requestId, // The requestId is used to identify the response
                        payload: `Hello from the extension!`,
                    } as MessageHandlerData<string>);
                } else if (command === "GET_DATA_ERROR") {
                    webviewView.webview.postMessage({
                        command,
                        requestId, // The requestId is used to identify the response
                        error: `Oops, something went wrong!`,
                    } as MessageHandlerData<string>);
                } else if (command === "POST_DATA") {
                    vscode.window.showInformationMessage(
                        `Received data from the webview: ${payload.msg}`
                    );
                }
            },
            undefined,
            this.context.subscriptions
        );
        webviewView.webview.html = this.getWebviewContent(this.context, webviewView.webview);
    }

    getWebviewContent = (context: ExtensionContext, webview: Webview) => {
        const jsFile = "main.bundle.js";
        const localServerUrl = "http://localhost:9000";

        const scriptUrl = [];
        const isProduction = context.extensionMode === ExtensionMode.Production;
        if (isProduction) {
            // Get the manifest file from the dist folder
            const manifest = readFileSync(
                join(context.extensionPath, "dist", "webview", "manifest.json"),
                "utf-8"
            );
            const manifestJson = JSON.parse(manifest);
            for (const [key, value] of Object.entries<string>(manifestJson)) {
                if (key.endsWith(".js")) {
                    scriptUrl.push(
                        webview
                            .asWebviewUri(
                                Uri.file(join(context.extensionPath, "dist", "webview", value))
                            )
                            .toString()
                    );
                }
            }
        } else {
            scriptUrl.push(`${localServerUrl}/${jsFile}`);
        }

        return `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
	</head>
	<body>
		<div id="root" class="w-full h-full"></div>

		${scriptUrl.map((url) => `<script src="${url}"></script>`).join("\n")}
	</body>
	</html>`;
    };

}
