class CreateDevices < ActiveRecord::Migration
  def change
    create_table :devices do |t|
      t.string :device_type
      t.string :name
      t.string :serial_number
      t.string :manufacturer
      t.string :model_number
      t.string :status
      t.text :location
      t.string :warranty

      t.timestamps
    end
  end
end
