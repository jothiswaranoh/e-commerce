class CreateUserSessions < ActiveRecord::Migration[8.0]
  def change
    create_table :user_sessions do |t|
      t.references :user, null: false, foreign_key: true
      t.string :access_token_hash
      t.string :refresh_token_hash
      t.string :ip_address
      t.string :user_agent
      t.datetime :expires_at
      t.datetime :revoked_at

      t.timestamps
    end
  end
end
