class ApplicationController < ActionController::Base
  before_action :prevent_page_caching

  private

  def prevent_page_caching
    response.headers["Cache-Control"] = "private, no-store"
  end
end
