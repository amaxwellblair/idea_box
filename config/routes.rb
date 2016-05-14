Rails.application.routes.draw do

  root to: "dashboard#index"

  namespace "api" do
    namespace "v1" do
      get "/ideas", to: "ideas#index"
      post "/ideas", to: "ideas#create"
      patch "/idea/:id", to: "ideas#update"
      delete "/idea/:id", to: "ideas#destroy"
    end
  end

end
