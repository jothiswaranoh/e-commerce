const WISHLIST_KEY_PREFIX = 'wishlist';
const WISHLIST_EVENT = 'wishlist-updated';

type StoredUser = {
  id?: string;
  email?: string;
};

function getStoredUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem('shophub_current_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getWishlistKey(): string | null {
  const user = getStoredUser();
  if (!user?.id) return null;
  return `${WISHLIST_KEY_PREFIX}:${user.id}`;
}

export function getWishlist(): Set<string> {
  const wishlistKey = getWishlistKey();
  if (!wishlistKey) return new Set();

  try {
    const raw = localStorage.getItem(wishlistKey);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

export function getWishlistCount(): number {
  return getWishlist().size;
}

export function toggleWishlistItem(id: string): boolean {
  const wishlistKey = getWishlistKey();
  if (!wishlistKey) return false;

  const wishlist = getWishlist();

  if (wishlist.has(id)) {
    wishlist.delete(id);
    localStorage.setItem(wishlistKey, JSON.stringify([...wishlist]));
    window.dispatchEvent(new CustomEvent(WISHLIST_EVENT));
    return false;
  }

  wishlist.add(id);
  localStorage.setItem(wishlistKey, JSON.stringify([...wishlist]));
  window.dispatchEvent(new CustomEvent(WISHLIST_EVENT));
  return true;
}

export function addWishlistListener(listener: () => void) {
  window.addEventListener(WISHLIST_EVENT, listener);
  window.addEventListener('storage', listener);

  return () => {
    window.removeEventListener(WISHLIST_EVENT, listener);
    window.removeEventListener('storage', listener);
  };
}
