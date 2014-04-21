var modRewrite = require('connect-modrewrite');

var projectConfig = {
  root: '/'
};

module.exports = function(grunt) {
  require('jit-grunt')(grunt, {
    express: 'grunt-express-server'
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jade: {
      release: {
        options: {
          data: {
            root: projectConfig.root
          }
        }
      },
      debug: {
        options: {
          data: {
            root: projectConfig.root,
            debug: true
          }
        }
      }
    },
    stylus: {
      compile: {
        options: {
          urlfunc: 'embedurl'
        },
        files: {
          'app/public/css/style.css': 'src/public/css/style.styl'
        }
      }
    },
    tsd: {
      reinstall: {
        options: {
          command: 'reinstall',
          config: 'tsd.json'
        }
      },
      refresh: {
        options: {
          command: 'reinstall',
          config: 'tsd.json',
          latest: true
        }
      }
    },
    typescript: {
      server: {
        src: ['src/**/*.ts', '!src/public/**/*.ts'],
        dest: 'src/',
        options: {
          module: 'commonjs',
          basePath: 'src',
          sourceMap: true,
          noImplicitAny: true
        }
      },
      client: {
        src: ['src/public/**/*.ts'],
        dest: 'src/public/',
        options: {
          module: 'amd',
          basePath: 'src/public',
          sourceMap: true,
          noImplicitAny: true
        }
      }
    },
    copy: {
      typescript: {
        files: [{
          expand: true,
          cwd: 'src/public/',
          src: ['**/*.ts'],
          dest: 'app/public/',
          filter: 'isFile'
        }]
      },
      deploy: {
        files: [{
          expand: true,
          cwd: 'app/public/',
          src: [
            '**',
            '!**/*.map', '!javascript/**'
          ],
          dest: 'dist/',
          filter: 'isFile'
        }]
      }
    },
    requirejs: {
      compile: {
        options: {
          name: 'main',
          baseUrl: 'app/public/javascript',
          mainConfigFile: 'app/public/javascript/config.js',
          out: 'app/public/js/main.js'
        }
      }
    },
    express: {
      dev: {
        options: {
          middleware: rewriteMiddleware,
          script: 'app/server.js'
        }
      }
    },
    connect: {
      dev: {
        options: {
          middleware: rewriteMiddleware
        }
      }
    },
    watch: {
      jade: {
        files: ['src/public/**/*.jade'],
        tasks: ['configure-jade', 'jade:debug']
      },
      stylus: {
        files: ['src/public/**/*.styl'],
        tasks: ['stylus'],
      },
      typescriptClient: {
        files: ['src/public/**/*.ts'],
        tasks: ['build-typescript-client']
      },
      typescriptServer: {
        files: ['src/**/*.ts', '!src/public/**/*.ts'],
        tasks: ['build-typescript-server']
      },
      public: {
        files: ['app/public/**/*.*'],
        options: {
          livereload: true
        }
      },
      server: {
        files: ['app/**/*.*', '!app/public/**/*.*'],
        tasks: ['serve'],
        options: {
          spawn: false
        }
      }
    },
    clean: {
      dist: ['dist/*'],
      options: {
        force: true
      }
    }
  });

  grunt.registerTask('default', [
    'debug-build',
    'serve'
  ]);
  grunt.registerTask('serve', [
    'express',
    'watch'
  ]);
  grunt.registerTask('deploy', [
    'release-build',
    'clean:dist',
    'copy:deploy'
  ]);
  grunt.registerTask('debug-build', [
    'configure-jade',
    'jade:debug',
    'stylus',
    'tsd:refresh',
    'build-typescript'
  ]);
  grunt.registerTask('release-build', [
    'configure-jade',
    'jade:release',
    'stylus',
    'tsd:refresh',
    'build-ts',
    'requirejs'
  ]);
  grunt.registerTask('build-ts', [
    'typescript',
    'postbuild-ts'
  ]);
  grunt.registerTask('build-ts-client', [
    'typescript:client',
    'postbuild-ts'
  ]);
  grunt.registerTask('build-ts-server', [
    'typescript:server',
    'postbuild-ts'
  ]);
  grunt.registerTask('postbuild-ts', [
    'configure-rename',
    'rename',
    'copy:typescript'
  ]);
  grunt.registerTask('configure-rename', function() {
    var files = grunt.file.expandMapping(
      ['src/**/*.js', 'src/**/*.js.map'], 'app/', {
        rename: function(destBase, destPath) {
          return destBase + destPath.replace(/^src\//, '');
        }
      }
    );
    grunt.config('rename', toObject(files));
  });
  grunt.registerTask('configure-jade', function() {
    var files = grunt.file.expandMapping(
      ['src/public/**/*.jade'], 'app/public/', {
        rename: function(destBase, destPath) {
          return destBase + destPath.replace(/^src\/public\//, '').replace(/\.jade$/, ".html");
        }
      }
    );
    grunt.config('jade.release.files', files);
    grunt.config('jade.debug.files', files);
  });
};

function rewriteMiddleware(connect, options) {
  console.log('hoge')
  return [
    modRewrite(['^' + projectConfig.root + '(?!html/).*\\.html$ /index.html [L]']),
    projectConfig.root === '/' ? connect.static(options.base)
      : function(req, res, next) {
        req.url = req.url.replace(new RegExp('^' + projectConfig.root), '/');
        return connect.static(options.base)(req, res, next);
      }
  ];
}

function toObject(array) {
  var obj = {};
  array.forEach(function(item, i) {
    obj[i] = item;
  });
  return obj;
}