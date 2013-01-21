class CreateChanges < ActiveRecord::Migration
  def change
    create_table :changes do |t|
      t.string :title
      t.integer :device_id
      t.text :description
      t.string :emergency
      t.integer :task_id
      t.text :precaution
      t.text :impact
      t.date :period_start
      t.date :period_end
      t.string :approval_status

      t.timestamps
    end
  end
end
