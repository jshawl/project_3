Rails.application.routes.draw do
  resources :trips do
    resources :locations, only: [:index, :new, :create] do
      get "search", on: :collection
    end
  end
  # i think this fixes your hardcoded id issue
  resources :locations, except: [:index, :new, :create] do
      get "search", on: :collection
  end
  root to:"trips#home"
end
