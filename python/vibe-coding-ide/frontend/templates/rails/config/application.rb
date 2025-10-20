require_relative 'boot'
require 'rails/all'

Bundler.require(*Rails.groups)

module RailsApp
  class Application < Rails::Application
    config.load_defaults 7.1
    config.api_only = false
    
    # Don't generate system test files
    config.generators.system_tests = nil
    
    # Set time zone
    config.time_zone = 'UTC'
    
    # The default locale is :en
    config.i18n.default_locale = :en
  end
end
