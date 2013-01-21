class AddPlanIdToChange < ActiveRecord::Migration
  def change
    add_column :changes, :plan_id, :integer
  end
end
