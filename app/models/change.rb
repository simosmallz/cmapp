class Change < ActiveRecord::Base
	has_many :tasks
	has_many :plans
  attr_accessible :approval_status, :description, :device_id, :emergency, :impact, :period_end, :period_start, :precaution, :task_id, :title, :plan_id
end
