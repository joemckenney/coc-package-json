import { commands, languages, ExtensionContext, workspace } from 'coc.nvim';
import { LogLevel, LoggingService } from './logging-service.js';
import { getDocumentFormattingEditProvider } from './providers.js';

import { forceFormat } from './formatters.js';

import json from '../package.json' assert { type: 'json' };

const { name, version } = json;

export async function activate(context: ExtensionContext): Promise<void> {
  const logger = new LoggingService();

  logger.logInfo(`Extension Name: ${name}.`);
  logger.logInfo(`Extension Version: ${version}.`);

  const configuration = workspace.getConfiguration('packageJson');

  const enabled = configuration.get<boolean>('enabled');
  const logLevel = configuration.get<LogLevel>('logLevel');

  if (!enabled) {
    return;
  }

  if (logLevel) {
    logger.setOutputLevel(logLevel);
  }

  context.subscriptions.push(
    languages.registerDocumentFormatProvider(
      [{ scheme: 'file', pattern: '**/package.json' }],
      getDocumentFormattingEditProvider(logger),
      100
    ),
    commands.registerCommand('packageJson.format', forceFormat(logger)),
    commands.registerCommand('packageJson.openOutput', () => logger.show())
  );
}
