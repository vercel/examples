# Configure host allowlist for Rails application
# This allows the app to be accessed through sandbox preview domains and localhost

Rails.application.configure do
    # Allow the ALLOWED_HOST environment variable to specify a custom host
    config.hosts << ENV['ALLOWED_HOST'] if ENV['ALLOWED_HOST'].present?
    
    # Allow sandbox preview domains
    config.hosts << /.+\.vercel\.run/
    config.hosts << /.+\.sbox\.bio/
    
    # Allow localhost and 127.0.0.1 for local development
    config.hosts << "localhost"
    config.hosts << "127.0.0.1"
end
  