require "active_support/core_ext/integer/time"
require "uri"

Rails.application.configure do
  # Do not reload code between requests
  config.enable_reloading = false

  # Eager load code on boot
  config.eager_load = true

  # Disable full error reports
  config.consider_all_requests_local = false

  # Cache public files for 1 year
  config.public_file_server.headers = {
    "cache-control" => "public, max-age=#{1.year.to_i}"
  }

  # Active Storage service
  config.active_storage.service = :local

  # Logging
  config.log_tags = [:request_id]
  config.logger = ActiveSupport::TaggedLogging.logger(STDOUT)

  # Log level
  config.log_level = ENV.fetch("RAILS_LOG_LEVEL", "info")

  # Silence health check logs
  config.silence_healthcheck_path = "/up"

  # Disable deprecation logging
  config.active_support.report_deprecations = false

  app_url = ENV["APP_URL"].presence || ENV["API_URL"].presence

  public_url_options =
    if app_url.present?
      uri = URI.parse(app_url)
      {
        host: uri.host,
        protocol: uri.scheme,
        port: uri.port == uri.default_port ? nil : uri.port
      }.compact
    else
      {
        host: ENV.fetch("APP_HOST", "34.192.69.120"),
        protocol: ENV.fetch("APP_PROTOCOL", "https"),
        port: ENV["APP_PORT"].presence
      }.compact
    end

  # Mailer URL configuration
  config.action_mailer.default_url_options = public_url_options

  # URL helpers (important for ActiveStorage / serializers / Blueprinter)
  Rails.application.routes.default_url_options = public_url_options

  # I18n fallback
  config.i18n.fallbacks = true

  # Do not dump schema after migrations
  config.active_record.dump_schema_after_migration = false

  # Limit attributes shown in inspect
  config.active_record.attributes_for_inspect = [:id]
end