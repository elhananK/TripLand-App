(function(global) {

  // map tells the System loader where to look for things
  var map = {
    'app':        'public', // 'dist',
    '@angular':   'node_modules/@angular',
    'rxjs':       'node_modules/rxjs',
    'ng2-file-upload' : 'node_modules/ng2-file-upload',
    'angular-in-memory-web-api': 'node_modules/angular-in-memory-web-api/bundles/in-memory-web-api.umd.js',
    'socket.io-client': 'node_modules/socket.io-client',
      '@ngui/popup': 'node_modules/@ngui/popup/dist/popup.umd.js',
      'ng2-formly': 'npm:ng2-formly/bundles/ng2-formly.umd.js',
      '@agm/core': 'node_modules/@agm/core/core.umd.js',
      // "angular2-google-maps": "npm:angular2-google-maps@0.14.0"
      // 'google-maps-angular2':      'npm:google-maps-angular2/core',
      // 'angular2-google-maps':   'https://npmcdn.com/angular2-google-maps@0.12.0'

  };

  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'app': { main: 'main.js',  defaultExtension: 'js' },
    'rxjs':                       { defaultExtension: 'js' },
    'socket.io-client':    { main: 'socket.io.js'},
    'ng2-file-upload' : {
      main: './ng2-file-upload.js',
      defaultExtension: 'js'
    }
      // "angular2-google-maps/core": {
      //     "defaultExtension": "js",
      //     "main": "index.js"
      // }
      // 'google-maps-angular2': {
      //     defaultExtension: 'js',
      //     main: 'index.js',
      //     format: 'cjs'
      // }
  };

  var ngPackageNames = [
    'common',
    'compiler',
    'core',
    'forms',
    'http',
    'platform-browser',
    'platform-browser-dynamic',
    'router',
    'upgrade'
  ];

  // Individual files (~300 requests):
  function packIndex(pkgName) {
    packages['@angular/'+pkgName] = { main: 'index.js', defaultExtension: 'js' };
  }


  // Bundled (~40 requests):
  function packUmd(pkgName) {
    packages['@angular/'+pkgName] = { main: '/bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
  }

  // Most environments should use UMD; some (Karma) need the individual index files
  var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;
  // Add package entries for angular packages
  ngPackageNames.forEach(setPackageConfig);

  var config = {
    map: map,
    packages: packages
  };

  System.config(config);

})(this);