class CreateStaffs < ActiveRecord::Migration
  def change
    create_table :staffs do |t|
      t.string :staff_id
      t.string :password
      t.string :first_name
      t.string :last_name
      t.string :email

      t.timestamps
    end
  end
end
