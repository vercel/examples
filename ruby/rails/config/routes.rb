Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check
  root "todos#index"
  resources :todos, only: %i[create edit update destroy]
end
