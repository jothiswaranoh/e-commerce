module ResponseRenderingConcern
  extend ActiveSupport::Concern

  def render_error(response_key = nil, custom_message = nil, custom_status = nil)
    response_key = "common.error" if response_key.blank?
    response = i18n_response(response_key)
    message = custom_message || response[:message]
    status = custom_status || response[:status]
    render json: { success: false, error: message, is_toast_display: true, data: nil }, status: status
  end

  def render_success(data = nil, response_key = nil, custom_message = nil, custom_status = nil)
    response_key = "common.success" if response_key.blank?
    response = i18n_response(response_key)
    message = custom_message || response[:message]
    status = custom_status || response[:status]
    render json: { success: true, message: message, data: format_response_data(data) }, status: status
  end

  def handle_response(data, response_key = nil, custom_message = nil, custom_status = nil)
    response_key = "common.success" if response_key.blank?
    if data.is_a?(Hash) && data[:error]
      render_error("common.operation_failed", data[:error], custom_status || :unprocessable_entity)
    elsif data.nil?
      render_error("common.not_found", custom_message, custom_status)
    elsif data.respond_to?(:errors) && data.errors.present?
      error_message = data.errors.full_messages.join(", ")
      render_error("common.validation_error", error_message, custom_status || :unprocessable_entity)
    else
      render_success(data, response_key, custom_message, custom_status)
    end
  end

  private

  def i18n_response(key)
    response = I18n.t("responses.#{key}", default: nil)
    raise KeyError, "Translation key 'responses.#{key}' is missing." if response.nil?
    { message: response[:message], status: response[:status] }
  end

  def format_response_data(data)
    return nil if data.nil?
    case data
    when Hash then data
    when Array then data.map { |item| format_single_item(item) }
    else format_single_item(data)
    end
  end

  def format_single_item(item)
    item.is_a?(Hash) ? item : item
  end
end
