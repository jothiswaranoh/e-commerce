field :images do |product|
  next [] unless product.images.attached?

  product.images.attachments.map do |attachment|
    {
      id: attachment.id,
      url: Rails.application.routes.url_helpers.rails_blob_url(
        attachment,
        host: ENV.fetch("APP_HOST"),
        protocol: ENV.fetch("APP_PROTOCOL", "http")
      )
    }
  end
end