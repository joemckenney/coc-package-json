import {
  CancellationToken,
  DocumentFormattingEditProvider,
  FormattingOptions,
  LinesTextDocument,
  TextEdit,
} from 'coc.nvim';

import { format } from './format.js';

import type { LoggingService } from './logging-service.js';

export function editProvider(
  logger: LoggingService
): DocumentFormattingEditProvider {
  return {
    async provideDocumentFormattingEdits(
      document: LinesTextDocument,
      _options: FormattingOptions,
      _token: CancellationToken
    ): Promise<TextEdit[]> {
      return format(document, { logger });
    },
  };
}
