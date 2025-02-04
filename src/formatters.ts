import {
  TextEdit,
  workspace,
  Range,
  LinesTextDocument,
  TextDocument,
} from 'coc.nvim';

import path from 'node:path';

import { LoggingService } from './logging-service.js';
import { sortPackageJson } from 'sort-package-json';

export function format(
  document: LinesTextDocument,
  { logger }: { logger: LoggingService }
): TextEdit[] {
  let formatted: string | null = null;
  const start = Date.now();

  try {
    formatted = sortPackageJson(document.getText());
  } catch (e) {
    logger.logError('Error formatting package.json', e);
  }

  if (!formatted) {
    return [];
  }

  logger.logInfo(`Formatting completed in ${Date.now() - start}ms.`);

  return [minimalEdit(document, formatted)];
}

function minimalEdit(document: TextDocument, string1: string) {
  const string0 = document.getText();

  let i = 0;
  while (
    i < string0.length &&
    i < string1.length &&
    string0[i] === string1[i]
  ) {
    ++i;
  }
  let j = 0;
  while (
    i + j < string0.length &&
    i + j < string1.length &&
    string0[string0.length - j - 1] === string1[string1.length - j - 1]
  ) {
    ++j;
  }
  const newText = string1.substring(i, string1.length - j);
  const pos0 = document.positionAt(i);
  const pos1 = document.positionAt(string0.length - j);

  return TextEdit.replace(Range.create(pos0, pos1), newText);
}

export function forceFormat(logger: LoggingService) {
  return async () => {
    try {
      const doc = await workspace.document;

      if (!doc || !doc.attached) {
        logger.logInfo('No active document. Nothing was formatted.');
        return;
      }

      const fileName = path.basename(doc.uri);
      if (fileName !== 'package.json') {
        logger.logInfo(
          'Document formatting only applies to package.json files'
        );
        return;
      }

      const edits = format(doc.textDocument, { logger });

      if (edits.length !== 1) {
        return;
      }

      await doc.applyEdits(edits);
    } catch (e) {
      logger.logError('Error formatting document', e);
    }
  };
}
