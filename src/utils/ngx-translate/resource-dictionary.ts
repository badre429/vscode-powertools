'use strict';
import * as vscode from 'vscode';

const fs = require('fs');

export class ResourceDictionary {
  private constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  private _resources: vscode.CompletionItem[] = [];
  private static _instance: ResourceDictionary;

  public setResources(resources: vscode.CompletionItem[]) {
    this._resources = resources;
  }

  public getResources(): vscode.CompletionItem[] {
    return this._resources;
  }
}
