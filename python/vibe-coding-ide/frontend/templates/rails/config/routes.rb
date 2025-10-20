Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Root path
  root 'home#index'

  # Health check endpoint
  get '/up', to: 'application#health_check'
end
