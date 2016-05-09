Rails.application.routes.draw do

  namespace "api" do
    namespace "v1" do
      get "/ideas", to: "ideas#index"
    end
  end

end
