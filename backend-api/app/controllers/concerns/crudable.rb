module Crudable
  extend ActiveSupport::Concern

  included do
    include ResponseRenderingConcern
    before_action :set_resource, only: [:show, :update, :destroy]
  end

  # GET /resources
  def index
    records = scoped_collection
    render_success(
      blueprint.render_as_json(records),
      success_response_key
    )
  end

  # GET /resources/:id
  def show
    render_success(
      blueprint.render_as_json(@resource),
      success_response_key
    )
  end

  # POST /resources
  def create
    record = model_class.new(resource_params)
    record.org_id = current_org.id if record.respond_to?(:org_id)

    if record.save
      render_success(
        blueprint.render_as_json(record),
        create_response_key,
        nil,
        :created
      )
    else
      handle_response(record)
    end
  end

  # PATCH /resources/:id
  def update
    if @resource.update(resource_params)
      render_success(
        blueprint.render_as_json(@resource),
        update_response_key
      )
    else
      handle_response(@resource)
    end
  end

  # DELETE /resources/:id
  def destroy
    @resource.destroy
    render_success(nil, delete_response_key)
  end

  private

  # 🔒 Org-safe scoping
  def scoped_collection
    scope = model_class.all
    scope = scope.where(org_id: current_org.id) if model_class.column_names.include?("org_id")
    scope
  end

  def set_resource
    @resource = scoped_collection.find(params[:id])
  end

  # 🧠 Infer model
  def model_class
    @model_class ||= self.class.name
      .sub("Controller", "")
      .singularize
      .constantize
  end

  # 🎨 Blueprint inference
  def blueprint
    @blueprint ||= "#{model_class}Blueprint".constantize
  end

  # 🧩 Response keys (override if needed)
  def success_response_key
    "common.success"
  end

  def create_response_key
    "common.created"
  end

  def update_response_key
    "common.updated"
  end

  def delete_response_key
    "common.deleted"
  end

  # 🚨 Must be implemented by controller
  def resource_params
    raise NotImplementedError, "Define resource_params in controller"
  end
end
