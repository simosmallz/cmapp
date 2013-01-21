class CreatePlans < ActiveRecord::Migration
  def change
    create_table :plans do |t|
      t.string :description
      t.integer :change_id

      t.timestamps
    end
  end
end
