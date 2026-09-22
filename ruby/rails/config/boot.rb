ENV["BUNDLE_GEMFILE"] ||= File.expand_path("../Gemfile", __dir__)
require "bundler/setup"

unless ENV["RAILS_ENV"] == "test"
  require "dotenv"
  Dotenv.load(File.expand_path(ENV.fetch("ENV_FILE", ".env.local"), File.expand_path("..", __dir__)))
end
