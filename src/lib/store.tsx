'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { CartItem, WishlistItem } from '@/types';
import { generateId } from '@/lib/utils';

type CartItemWithId = CartItem & { id: string };

interface CartState {
  items: CartItemWithId[];
  wishlist: WishlistItem[];
  loading: boolean;
}

const initialState: CartState = {
  items: [],
  wishlist: [],
  loading: true,
};

type CartAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_WISHLIST'; payload: WishlistItem }
  | { type: 'LOAD_STATE'; payload: { items: CartItemWithId[]; wishlist: WishlistItem[] } };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'LOAD_STATE':
      return { ...state, ...action.payload, loading: false };

    case 'ADD_TO_CART': {
      const { productId, size, color, quantity } = action.payload;
      const existingIndex = state.items.findIndex(
        (item) =>
          item.productId === productId &&
          item.size === size &&
          item.color === color
      );

      if (existingIndex >= 0) {
        const updated = [...state.items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return { ...state, items: updated };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, id: generateId() }],
      };
    }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(1, action.payload.quantity) }
            : item
        ),
      };

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'TOGGLE_WISHLIST': {
      const exists = state.wishlist.find(
        (item) => item.productId === action.payload.productId
      );
      if (exists) {
        return {
          ...state,
          wishlist: state.wishlist.filter(
            (item) => item.productId !== action.payload.productId
          ),
        };
      }
      return { ...state, wishlist: [...state.wishlist, action.payload] };
    }

    default:
      return state;
  }
}

interface CartContextType {
  items: CartItemWithId[];
  wishlist: WishlistItem[];
  loading: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (productId: string) => boolean;
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = 'essanza-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      } else {
        dispatch({ type: 'LOAD_STATE', payload: { items: [], wishlist: [] } });
      }
    } catch {
      dispatch({ type: 'LOAD_STATE', payload: { items: [], wishlist: [] } });
    }
  }, []);

  useEffect(() => {
    if (!state.loading) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ items: state.items, wishlist: state.wishlist })
      );
    }
  }, [state.items, state.wishlist, state.loading]);

  const addToCart = useCallback((item: CartItem) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const toggleWishlist = useCallback((item: WishlistItem) => {
    dispatch({ type: 'TOGGLE_WISHLIST', payload: item });
  }, []);

  const isInWishlist = useCallback(
    (productId: string) =>
      state.wishlist.some((item) => item.productId === productId),
    [state.wishlist]
  );

  const cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const wishlistCount = state.wishlist.length;

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        wishlist: state.wishlist,
        loading: state.loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        cartCount,
        cartTotal,
        wishlistCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
