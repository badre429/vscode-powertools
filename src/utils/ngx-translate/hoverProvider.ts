'use strict';
import * as vscode from 'vscode';
import { ResourceDictionary } from './resource-dictionary';

export function createHoverProvider (): vscode.HoverProvider {
    const config = vscode.workspace.getConfiguration();
    
    return {
        provideHover(document, position) {
            
            const resourceDictionary = ResourceDictionary.Instance.getResources();
            let key: string;
            let checker = undefined;
            let range;

            const textMatchers = config.get('bmg-ngx-translate.lookup.regex') as string[];
            for (const check of textMatchers) {
                range = document.getWordRangeAtPosition(position, new RegExp(check));
                if (range) {
                    checker = check;
                    break;
                }
            }

            if (checker === undefined) {
                return null;
            }

            const text = document.getText(range);

            const val = new RegExp(checker);
            const regexMatch = val.exec(text);
            if (!regexMatch) {
                return null;
            }

            key = regexMatch[1];

            const resource = resourceDictionary.find(item => item.insertText === key);

            if (!resource) {
                return null;
            }

            return new vscode.Hover({
                language: 'html',
                value: `${key}\nResource value: '${resource.detail}'`
            });
        }
    };
}