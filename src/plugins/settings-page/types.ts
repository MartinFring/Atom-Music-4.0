export type PluginMeta = {
  id: string;
  name: string;
  description: string;
  restartNeeded: boolean;
  defaultConfig: Record<string, unknown>;
};
