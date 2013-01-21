class CreateContactPeople < ActiveRecord::Migration
  def change
    create_table :contact_people do |t|
      t.string :user_id
      t.string :first_name
      t.string :last_name
      t.string :position
      t.integer :client_id

      t.timestamps
    end
  end
end
