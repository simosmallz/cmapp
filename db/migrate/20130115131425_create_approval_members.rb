class CreateApprovalMembers < ActiveRecord::Migration
  def change
    create_table :approval_members do |t|
      t.string :name
      t.string :position

      t.timestamps
    end
  end
end
