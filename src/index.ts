import { commands, languages, ExtensionContext } from 'coc.nvim';
import { LoggingService } from './logging-service.js';
import { editProvider } from './edit-provider.js';

import { forceFormat } from './format.js';

import json from '../package.json' assert { type: 'json' };

const { name, version } = json;

export async function activate(context: ExtensionContext): Promise<void> {
  const logger = new LoggingService();

  logger.logInfo(`Extension Name: ${name}.`);
  logger.logInfo(`Extension Version: ${version}.`);

  context.subscriptions.push(
    languages.registerDocumentFormatProvider(
      [{ scheme: 'file', pattern: '**/package.json' }],
      editProvider(logger),
      100
    ),
    commands.registerCommand('packageJson.format', forceFormat(logger)),
    commands.registerCommand('packageJson.openOutput', () => logger.show())
  );
}
