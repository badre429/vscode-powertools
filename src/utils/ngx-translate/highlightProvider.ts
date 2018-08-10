import * as vscode from 'vscode';
import { ResourceDictionary } from './resource-dictionary';

let diagnosticCollection: vscode.DiagnosticCollection;

export function createHighlightProvider(context: vscode.ExtensionContext) {

	diagnosticCollection = vscode.languages.createDiagnosticCollection("translateErrors");
	context.subscriptions.push(diagnosticCollection);
    
    let activeEditor = vscode.window.activeTextEditor;
	if (activeEditor) {
		triggerUpdateDecorations(activeEditor.document.uri);
	}

	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			triggerUpdateDecorations(editor.document.uri);
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			triggerUpdateDecorations(event.document.uri);
		}
	}, null, context.subscriptions);

	var timeout: NodeJS.Timer | null = null;
	function triggerUpdateDecorations(uri: vscode.Uri) {
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(() => updateDecorations(uri), 500);
	}

	const config = vscode.workspace.getConfiguration();
    const textMatchers = config.get('bmg-ngx-translate.lookup.regex') as string[];

	function updateDecorations(uri: vscode.Uri) {
		if (!activeEditor) {
			return;
		}
		
		const resourceDictionary = ResourceDictionary.Instance.getResources();
        const text = activeEditor.document.getText();
		const untrackedStrings: vscode.Diagnostic[] = [];
        let match: RegExpExecArray | null;

        for (const matcher of textMatchers) {
			const regex = new RegExp(matcher, "gm");

			while ((match = regex.exec(text)) !== null) {
				// This is necessary to avoid infinite loops with zero-width matches
				if (match.index === regex.lastIndex) {
					regex.lastIndex++;
				}
				
				let key = match[1];
				const resource = resourceDictionary.find(item => item.insertText === key);
                if (!resource) {
					console.log('missing: ' + key);
                    const startPos = activeEditor.document.positionAt(match.index);
			        const endPos = activeEditor.document.positionAt(match.index + match[0].length);
					
					let diagnostic = new vscode.Diagnostic(new vscode.Range(startPos, endPos), `Missing resource string: '${key}'`, vscode.DiagnosticSeverity.Warning);
					untrackedStrings.push(diagnostic);
                }
			}
        }
		
		diagnosticCollection.set(uri, untrackedStrings);
	}
}