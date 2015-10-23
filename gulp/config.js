'use strict';
var path = require('path');
var modRewrite = require('connect-modrewrite');

// Default settings
module.exports.uglifyJs = process.env.UGLIFYJS || true; // to remove .min sufix edit template manually
module.exports.minifyCss = process.env.MINIFYCSS || true; // to remove .min sufix edit template manually
module.exports.cacheBust = process.env.CACHEBUST || true;
module.exports.optimizeImages = process.env.OPTIMIZEIMAGES || true;
module.exports.lintJs = process.env.LINTJS || false;
module.exports.prettyUrl = false;

// Deploy URLs
var siteUrl = 'http://hafizhamidun.com';
var githubCname = 'hafizhamidun.com';

// Default paths
var app = 'app';
var tmp = '.tmp';
var dist = 'dist';
var bowerDir = 'bower_components';

// Default paths in app folder
var data = 'data';
var fonts = 'assets/fonts';
var icons = 'assets/icons';
var images = 'assets/images';
var scripts = 'assets/scripts';
var styles = 'assets/styles';
var views = 'views';

var languages = {
  list: ['en'],
  primary: 'en'
};

// Rewrite rules enables removing .html extensions in development.
// This are possible routes for same test.html file:
// http://localhost:3000/test.html
// http://localhost:3000/test
var rewriteRules = [
  '^/$ - [L]', // default site root handling (index.html)
  '.html$ - [L]', // ignore routes ends with '.html'
  '(.*)/$ $1/index.html [L]', // routes with trailing slash are directories -> rewrite to directory index.html
  '\\/\[a-zA-Z0-9_\\-\@.]+\\.\[a-zA-Z0-9]+$ - [L]', // ignore files with extension (eg. .css, .js, ...)
  '(.*)$ $1.html [L]' // redirect routes ends with string without trailing slash to original html
];

// Browser sync task config
module.exports.browserSync = {
  dev: {
    server: {
      baseDir: [tmp, app],
      routes: {
        '/bower_components': bowerDir
      }
    },
    notify: false,
    debugInfo: false,
    online: true,
    host: 'localhost',
    middleware: [
      modRewrite(rewriteRules)
    ]
  },
  dist: {
    server: {
      baseDir: dist
    },
    notify: false,
    debugInfo: false,
    host: 'localhost',
    middleware: [
      modRewrite(rewriteRules)
    ]
  }
};

// Build size task config
module.exports.buildSize = {
  srcAll: dist + '/**/*',
  cfgAll: {
    title: 'build',
    gzip: true
  },
  srcCss: path.join(dist, styles, '/**/*'),
  cfgCss: {
    title: 'CSS',
    gzip: true
  },
  srcJs: path.join(dist, scripts, '/**/*'),
  cfgJs: {
    title: 'JS',
    gzip: true
  },
  srcImages: path.join(dist, images, '/**/*'),
  cfgImages: {
    title: 'Images',
    gzip: false
  }
};

// Clean task config
// Be carefull what you cleaning!
module.exports.clean = [tmp, dist, '.publish', '.divshot-cache'];

// Copy fonts task config
module.exports.copyFonts = {
  src: [
    path.join(app, fonts, '**/*'),
    'bower_components/bootstrap-sass/assets/fonts/bootstrap/*'
  ],
  dest: path.join(dist, fonts)
};

// Copy fonts task config
module.exports.copyIcons = {
  src: path.join(app, icons, '**/*'),
  dest: path.join(dist, icons)
};

// Copy extras task config
module.exports.copyExtras = {
  src: [
    app + '/*.*',
    '!' + app + '/*.html'
  ],
  dest: dist,
  cfg: {
    dot: true
  }
};

// Deploy task config
// FTP settings are in .env file
module.exports.deploy = {
  src: dist + '/**',
  dev: {
    root: dist,
    hostname: process.env.FTP_DEV_HOSTNAME,
    username: process.env.FTP_DEV_USER,
    destination: process.env.FTP_DEV_DEST
  },
  dist: {
    root: dist,
    hostname: process.env.FTP_DIST_HOSTNAME,
    username: process.env.FTP_DIST_USER,
    destination: process.env.FTP_DIST_DEST
  }
};

// Images task config
module.exports.images = {
  src: path.join(app, images, '**/*.{gif,png,jpg}'),
  srcSVG: path.join(app, images, '**/*.svg'),
  dest: path.join(dist, images),
  cfg: {
    progressive: true,
    interlaced: true,
    multipass: true,
    svgoPlugins: [{cleanupIDs: false}]
  }
};

// Modernizr task config
module.exports.modernizr = {
  enabled: true,
  src: [
    path.join(app, scripts,'**/*.js'),
    path.join(tmp, styles,'*.css')
  ],
  dest: path.join(tmp, scripts, 'plugins'),
  cfg: {
    silent: true,
    options: [
      'setClasses',
      'addTest',
      'html5printshiv',
      'testProp',
      'fnBind'
    ],
    excludeTests: ['hidden']
  }
};

// JSHint task config
module.exports.eslint = {
  src: [
    path.join(app, scripts,'**/*.js'),
    path.join('!' + app, scripts,'plugins/**/*.js') // do not lint external plugins
  ]
};

// User scripts task
module.exports.scripts = {
  src: path.join(app, scripts, '**/*.js'),
  dest: path.join(tmp, scripts)
};

// Coffeescript task
module.exports.coffee = {
  src: path.join(app, scripts, '**/*.coffee'),
  dest: path.join(tmp, scripts)
};

// Styles task config
module.exports.styles = {
  src: path.join(app, styles, '*.scss'),
  dest: path.join(tmp, styles),
  sassCfg: {},
  autoprefixerCfg: {browsers: ['last 2 version']}
};

// Templates task config
module.exports.templates = {
  languages: languages,
  src: path.join(app, views, '**/!(_)*.jade'),
  srcBuild: path.join(tmp, 'jade/**/!(_)*.jade'),
  dest: tmp,
  destBuild: path.join(dist),
  cfg: {
    basedir: path.join(app, views),
    pretty: true,
    compileDebug: true
  }
};

// TemplatesData task config
module.exports.templatesData = {
  src: path.join(app, views, data, '/**/*.json'),
  dest: app + '/views',
  dataName: 'data.json',
  dataPath: path.join(app, views, 'data.json')
};

module.exports.useref = {
  src: path.join(app, views, '/**/*.jade'),
  dest: dist,
  destJade: path.join(tmp, 'jade'),
  assetsCfg: {
    searchPath : app
  },
  revManifestCfg: {merge: true}
};

// Watch task config
module.exports.watch = {
  styles: path.join(app, styles, '/**/*.scss'),
  jade: [
    path.join(app, views, '/**/*.jade'),
    path.join(app, views, data, '/**/*.json')
  ],
  scripts: path.join(app, scripts, '/**/*.{js,coffee}'),
  wiredep: 'bower.json'
};

// Wiredep task config
module.exports.wiredep = {
  sass: {
    src: path.join(app, styles, '/*.scss'),
    dest: path.join(app, styles),
    cfg: {
      ignorePath: '',
      overides: {}
    }
  },
  jade: {
    src: path.join(app, views, '/layouts/*.jade'),
    dest: path.join(app, views, '/layouts'),
    cfg: {
      exclude: ['modernizr'],
      ignorePath: '../../',
      overides: {}
    }
  }
}

// Github Pages task config
module.exports.ghPages = {
  src: path.join(dist, '/**/*'),
  cname: githubCname,
  cfg: {
    remoteUrl: 'https://github.com/hafizhamidunsb/hafizhamidunsb.github.io.git',
    branch: 'master'
  }
}

// Cdnify task config
module.exports.cdnify = {
  enabled: false,
  src: path.join(dist, '/**/*.{css,html}'),
  cfg: {
    base: siteUrl,
    html: {
      'link[rel="shortcut icon"]': 'href',
      'link[rel="apple-touch-icon"]': 'href',
      'link[rel="apple-touch-icon-precomposed"]': 'href',
      'link[rel="icon"]': 'href',
      'link[rel="manifest"]': 'href',
      'meta[name="msapplication-TileImage"]': 'content',
      'meta[name="msapplication-config"]': 'content'
    }
  }
}

// Sitemap task config
module.exports.sitemap = {
  enabled: true,
  src: path.join(dist, '/**/*.html'),
  cfg: {
    siteUrl: siteUrl,
    changefreq: 'hourly',
    priority: 0.5,
  }
}
