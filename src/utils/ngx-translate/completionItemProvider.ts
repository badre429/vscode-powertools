'use strict';
import * as vscode from 'vscode';
import { ResourceDictionary } from './resource-dictionary';

export function createCompletionItemProvider(): vscode.CompletionItemProvider {
  return {
    provideCompletionItems: () => {
      return ResourceDictionary.Instance.getResources();
    }
  };
}
