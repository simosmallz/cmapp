class AddCidToTask < ActiveRecord::Migration
  def change
    add_column :tasks, :change_id, :integer
  end
end
