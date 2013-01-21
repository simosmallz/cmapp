# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20130117150014) do

  create_table "approval_members", :force => true do |t|
    t.string   "name"
    t.string   "position"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "categories", :force => true do |t|
    t.string   "type"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "changes", :force => true do |t|
    t.string   "title"
    t.integer  "device_id"
    t.text     "description"
    t.string   "emergency"
    t.integer  "task_id"
    t.text     "precaution"
    t.text     "impact"
    t.date     "period_start"
    t.date     "period_end"
    t.string   "approval_status"
    t.datetime "created_at",      :null => false
    t.datetime "updated_at",      :null => false
    t.integer  "plan_id"
  end

  create_table "clients", :force => true do |t|
    t.string   "name"
    t.string   "industry"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "contact_people", :force => true do |t|
    t.string   "user_id"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "position"
    t.integer  "client_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
    t.string   "email"
  end

  create_table "devices", :force => true do |t|
    t.string   "device_type"
    t.string   "name"
    t.string   "serial_number"
    t.string   "manufacturer"
    t.string   "model_number"
    t.string   "status"
    t.text     "location"
    t.string   "warranty"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  create_table "plans", :force => true do |t|
    t.string   "description"
    t.integer  "change_id"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "staffs", :force => true do |t|
    t.string   "staff_user_id"
    t.string   "password"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "email"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  create_table "tasks", :force => true do |t|
    t.text     "description"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
    t.integer  "change_id"
  end

end
