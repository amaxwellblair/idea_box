class Idea < ActiveRecord::Base
  enum quality: [:bad, :good, :excellent]
end
