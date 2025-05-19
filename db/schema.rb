# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_05_19_162522) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "accounts", force: :cascade do |t|
    t.string "name"
    t.decimal "opening_balance", precision: 10, scale: 2
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_accounts_on_user_id"
  end

  create_table "bills", force: :cascade do |t|
    t.decimal "amount", precision: 10, scale: 2, null: false
    t.string "description"
    t.integer "frequency", default: 0, null: false
    t.date "next_due_date", null: false
    t.bigint "account_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_bills_on_account_id"
    t.index ["frequency"], name: "index_bills_on_frequency"
    t.index ["next_due_date"], name: "index_bills_on_next_due_date"
  end

  create_table "categories", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_categories_on_name"
  end

  create_table "families", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_families_on_name"
  end

  create_table "transactions", force: :cascade do |t|
    t.integer "kind", default: 0, null: false
    t.string "bank_name"
    t.decimal "amount", precision: 10, scale: 2, null: false
    t.date "happened_at", null: false
    t.text "notes"
    t.integer "installments_qty"
    t.bigint "original_id"
    t.bigint "account_id", null: false
    t.bigint "user_id", null: false
    t.bigint "category_id"
    t.bigint "bill_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["account_id"], name: "index_transactions_on_account_id"
    t.index ["bill_id"], name: "index_transactions_on_bill_id"
    t.index ["category_id"], name: "index_transactions_on_category_id"
    t.index ["happened_at"], name: "index_transactions_on_happened_at"
    t.index ["kind"], name: "index_transactions_on_kind"
    t.index ["original_id"], name: "index_transactions_on_original_id"
    t.index ["user_id"], name: "index_transactions_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "first_name"
    t.string "last_name"
    t.bigint "family_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["family_id"], name: "index_users_on_family_id"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "accounts", "users"
  add_foreign_key "bills", "accounts"
  add_foreign_key "transactions", "accounts"
  add_foreign_key "transactions", "bills"
  add_foreign_key "transactions", "categories"
  add_foreign_key "transactions", "transactions", column: "original_id"
  add_foreign_key "transactions", "users"
end
