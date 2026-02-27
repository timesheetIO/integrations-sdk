import type { IntegrationContext } from './context';

export type IntegrationHandler<
  TInput = void,
  TOutput = void,
  TConfig = Record<string, unknown>
> = (input: TInput, context: IntegrationContext<TConfig>) => Promise<TOutput>;

export function defineHandler<
  TInput = void,
  TOutput = void,
  TConfig = Record<string, unknown>
>(fn: IntegrationHandler<TInput, TOutput, TConfig>): IntegrationHandler<TInput, TOutput, TConfig> {
  return fn;
}
