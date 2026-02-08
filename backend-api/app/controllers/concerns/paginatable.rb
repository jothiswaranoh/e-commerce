module Paginatable
  extend ActiveSupport::Concern

  DEFAULT_PER_PAGE = 10
  MAX_PER_PAGE = 100

  def paginate(scope)
    page = params[:page].to_i
    page = 1 if page < 1

    per_page = params[:per_page].to_i
    per_page = DEFAULT_PER_PAGE if per_page < 1
    per_page = MAX_PER_PAGE if per_page > MAX_PER_PAGE

    scope.paginate(page: page, per_page: per_page)
  end

  def pagination_meta(collection)
    {
      current_page: collection.current_page,
      per_page: collection.per_page,
      total_pages: collection.total_pages,
      total_count: collection.total_entries
    }
  end
end