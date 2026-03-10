class ApplicationController < ActionController::API
  include Authentication

  private

  def handle_response(success: true, message: nil, error: nil, status: :ok, data: {})
    response_payload = { success: success }
    response_payload[:message] = message if message
    response_payload[:error] = error if error
    response_payload.merge!(data)

    render json: response_payload, status: status
  end
end
