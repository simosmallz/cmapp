class Client < ActiveRecord::Base
  attr_accessible :industry, :name
  validates :name, :industry, :presence=>true
  validates :name, :uniqueness=>true
  has_many :contact_people, :dependent => :destroy
end
