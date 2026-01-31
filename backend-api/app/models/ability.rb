class Ability
  include CanCan::Ability

  def initialize(user)
    return unless user

    if user.admin?
      can :manage, Category, org_id: user.org_id
    elsif user.customer?
      can :read, Category, org_id: user.org_id
    end
  end
end