module Api
  module V1
    class IdeasController < ApiController
      respond_to :json
      def index
        respond_with Idea.all
      end

      def create
        idea = Idea.create(idea_params)
        respond_with idea, status: 201, location: nil
      end

      private
        def idea_params
          params.permit(:title, :body)
        end
    end
  end
end
