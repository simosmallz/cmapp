class Staff < ActiveRecord::Base
  attr_accessible :email, :first_name, :last_name, :password, :staff_user_id
  validates :email, :first_name, :last_name, :password, :staff_id, :presence=>true
  validates :email, :staff_id, :uniqueness=>true
end
