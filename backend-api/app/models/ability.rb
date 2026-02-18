class Ability
  include CanCan::Ability

  def initialize(user)
    can :read, [Category, Product]

    return unless user

    if user.admin?
      can :manage, [Category, Product, Order], org_id: user.org_id
      can :manage, User

      can :manage, ProductVariant, product: { org_id: user.org_id }

    elsif user.customer?
      can :read, [Category, Product], org_id: user.org_id
      can :read, ProductVariant

      can :create, Order
      can :read, Order, user_id: user.id
    end
  end
end