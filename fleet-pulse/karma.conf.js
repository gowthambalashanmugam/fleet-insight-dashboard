// Karma configuration - extends Angular's default config
module.exports = function (config) {
  config.set({
    files: [
      ...(config.files || []),
      { pattern: 'src/**/*.scss', included: false, served: true, watched: true }
    ]
  });
};
