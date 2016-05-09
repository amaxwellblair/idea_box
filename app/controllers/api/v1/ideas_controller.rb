module Api
  module V1
    class IdeasController < ApiController
      respond_to :json
      def index
        respond_with Idea.all
      end
    end
  end
end
