class AddQualityToIdeas < ActiveRecord::Migration
  def change
    add_column :ideas, :quality, :integer
  end
end
