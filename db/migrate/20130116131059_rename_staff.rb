class RenameStaff < ActiveRecord::Migration
  def up
  	change_table :staffs do |t|
  		t.rename :staff_id, :staff_user_id
  	end
  end

  def down
  end
end
