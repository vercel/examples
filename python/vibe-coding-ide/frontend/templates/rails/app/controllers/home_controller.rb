class HomeController < ApplicationController
  def index
    @message = "Welcome to Ruby on Rails!"
    @timestamp = Time.current
  end
end
