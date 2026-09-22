require "sinatra/base"
require "json"
require "time"

class App < Sinatra::Base
  SAMPLE_ITEMS = [
    { id: 1, name: "Service Item 1", value: 100 },
    { id: 2, name: "Service Item 2", value: 200 },
    { id: 3, name: "Service Item 3", value: 300 }
  ].freeze

  before do
    content_type :json
  end

  get "/svc/api" do
    json(
      message: "Sinatra service is running",
      mountedAt: "/svc/api"
    )
  end

  get "/svc/api/status" do
    json(
      service: "backend",
      framework: "sinatra",
      mountedAt: "/svc/api",
      timestamp: Time.now.utc.iso8601
    )
  end

  get "/svc/api/items" do
    json(items: SAMPLE_ITEMS, count: SAMPLE_ITEMS.length)
  end

  get "/svc/api/items/:id" do
    item = SAMPLE_ITEMS.find { |value| value[:id] == params[:id].to_i }
    halt 404, json(error: "Item not found") if item.nil?

    json(item: item)
  end

  private

  def json(payload)
    JSON.generate(payload)
  end
end
