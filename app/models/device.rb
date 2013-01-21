class Device < ActiveRecord::Base
  attr_accessible :device_type, :location, :manufacturer, :model_number, :name, :serial_number, :status, :warranty
end
