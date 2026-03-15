const WISHLIST_KEY = 'wishlist';
const WISHLIST_EVENT = 'wishlist-updated';

export function getWishlist(): Set<string> {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

export function getWishlistCount(): number {
  return getWishlist().size;
}

export function toggleWishlistItem(id: string): boolean {
  const wishlist = getWishlist();

  if (wishlist.has(id)) {
    wishlist.delete(id);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify([...wishlist]));
    window.dispatchEvent(new CustomEvent(WISHLIST_EVENT));
    return false;
  }

  wishlist.add(id);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify([...wishlist]));
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
