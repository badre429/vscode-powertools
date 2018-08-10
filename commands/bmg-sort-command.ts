// command to complete all i18n strings
import { BmgCommand } from './bmg-command';
import * as vscode from 'vscode';
import { IParamsLoader } from '../utils/interfaces';

function getUniqueArray(lines) {
  var unique = [];
  for (var i = 0; i < lines.length; ++i) {
    if (unique.length === 0 || unique[unique.length - 1] !== lines[i]) {
      unique.push(lines[i]);
    }
  }
  return unique;
}

function reverseCompare(a, b) {
  return a < b ? 1 : -1;
}

function caseInsensitiveCompare(a, b) {
  return a.localeCompare(b, { sensitivity: 'base' });
}

function lineLengthCompare(a, b) {
  return a.length > b.length ? 1 : -1;
}

function shuffleCompare(a, b) {
  return Math.random() > 0.5 ? 1 : -1;
}

export class BmgSortCommand extends BmgCommand {
  constructor(private context: vscode.ExtensionContext) {
    super(context, 'extension.bmg.sort');

    this.paramsLoader.push({
      key: 'string',
      command: this,
      value: null,
      load: this.LoadFunctionOfSelect('direction', [
        'Asc Case Insensitive',
        'Asc',
        'Dec',
        'Line Length',
        'Unique',
        'Shuffle'
      ])
    });
  }

  sortActiveSelection(algorithm, removeDuplicateValues) {
    var textEditor = vscode.window.activeTextEditor;
    var selection = textEditor.selection;
    if (selection.isSingleLine) {
      return;
    }
    this.sortLines(
      textEditor,
      selection.start.line,
      selection.end.line,
      algorithm,
      removeDuplicateValues
    );
  }

  sortLines(textEditor, startLine, endLine, algorithm, removeDuplicateValues) {
    var lines = [];
    for (var i = startLine; i <= endLine; i++) {
      lines.push(textEditor.document.lineAt(i).text);
    }
    lines.sort(algorithm);

    if (removeDuplicateValues) {
      lines = getUniqueArray(lines);
    }

    textEditor.edit(function(editBuilder) {
      var range = new vscode.Range(
        startLine,
        0,
        endLine,
        textEditor.document.lineAt(endLine).text.length
      );
      editBuilder.replace(range, lines.join('\n'));
    });
  }
  Run() {
    var direction = this.params['direction'];
    switch (direction) {
      case 'Asc':
        this.sortActiveSelection(undefined, false);
        break;
      case 'Dec':
        this.sortActiveSelection(reverseCompare, false);
        break;
      case 'Asc Case Insensitive':
        this.sortActiveSelection(caseInsensitiveCompare, false);
        break;
      case 'Line Length':
        this.sortActiveSelection(lineLengthCompare, false);
        break;
      case 'Unique':
        this.sortActiveSelection(undefined, true);
        break;
      case 'Shuffle':
        this.sortActiveSelection(shuffleCompare, false);
        break;
      default:
        break;
    }
  }
}
