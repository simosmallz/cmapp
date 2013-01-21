class Task < ActiveRecord::Base
	belongs_to :change
  attr_accessible :description
end
