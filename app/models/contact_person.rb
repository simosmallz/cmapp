class ContactPerson < ActiveRecord::Base
  attr_accessible :client_id, :first_name, :last_name, :position, :user_id, :email
  belongs_to :client
end
