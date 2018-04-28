// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  DebugLogging: true,
  LoggingLevel: 4, // Debug
  LoginRequired: true,

  IDServerUrl: 'http://localhost:41016',
  APIBaseUrl: 'http://localhost:54020/api/',
  AppLoginCallbackUrl: 'http://localhost:20000/logincallback.html',
  AppLoginSlientRevewCallbackUrl: 'http://localhost:20000/silentrenewcallback.html',
  AppLogoutCallbackUrl: 'http://localhost:20000',
  AppHost: 'http://localhost:20000',

  AppGallery: 'http://localhost:1601',
};
