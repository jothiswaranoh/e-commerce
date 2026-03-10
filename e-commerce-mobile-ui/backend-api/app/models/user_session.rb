class UserSession < ApplicationRecord
  belongs_to :user

  scope :active, -> {
    where(revoked_at: nil)
      .where("expires_at > ?", Time.current)
  }

  def self.create_for(user)
    payload = { user_id: user.id }

    token = JsonWebToken.encode(payload, 30.minutes.from_now)
    hashed = Digest::SHA256.hexdigest(token)

    session = create!(
      user: user,
      access_token_hash: hashed,
      expires_at: 30.minutes.from_now
    )

    {
      session: session,
      access_token: token
    }
  end

  def self.find_by_access_token(token)
    hashed = Digest::SHA256.hexdigest(token)
    active.find_by(access_token_hash: hashed)
  end
end
