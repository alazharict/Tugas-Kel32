import { useState, useEffect, useCallback } from 'react';
import favoriteService from '../services/favoriteService';
import userService from '../services/userService';

/**
 * Get user identifier from localStorage or generate new one
 */
const getUserIdentifier = () => {
  return userService.getUserIdentifier();
};

/**
 * Helper to normalize responses from favoriteService (handles axios and wrapper shapes)
 */
function normalizeResponse(response) {
  if (!response) return { success: false, data: [] };

  // axios-style: response.data
  if (response.data !== undefined) {
    const body = response.data;
    if (Array.isArray(body)) return { success: true, data: body };
    if (body && typeof body === 'object') {
      if (body.success !== undefined) return { success: !!body.success, data: body.data || [], message: body.message };
      if (body.data !== undefined) return { success: true, data: body.data };
      return { success: true, data: body };
    }
    return { success: true, data: body };
  }

  // wrapper-style: response.success
  if (response.success !== undefined) {
    return { success: !!response.success, data: response.data || [], message: response.message };
  }

  // fallback: assume response is the data
  if (Array.isArray(response)) return { success: true, data: response };
  return { success: true, data: response };
}

/**
 * Custom hook for fetching favorites
 * @returns {Object} - { favorites, loading, error, refetch }
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userIdentifier = getUserIdentifier();

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await favoriteService.getFavorites(userIdentifier);

      const normalized = normalizeResponse(response);
      if (normalized.success) {
        setFavorites(normalized.data || []);
      } else {
        throw new Error(normalized.message || 'Failed to fetch favorites');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching favorites');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [userIdentifier]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return {
    favorites,
    loading,
    error,
    refetch: fetchFavorites,
  };
}

/**
 * Custom hook for toggling favorites
 * @returns {Object} - { toggleFavorite, loading, error }
 */
export function useToggleFavorite() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userIdentifier = getUserIdentifier();

  const toggleFavorite = async (recipeId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await favoriteService.toggleFavorite({
        recipe_id: recipeId,
        user_identifier: userIdentifier,
      });

      const normalized = normalizeResponse(response);
      if (normalized.success) {
        return normalized.data || true;
      }

      setError(normalized.message || 'Failed to toggle favorite');
      return null;
    } catch (err) {
      setError(err.message || 'An error occurred while toggling favorite');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    toggleFavorite,
    loading,
    error,
  };
}

/**
 * Custom hook to check if a recipe is favorited
 * @param {string} recipeId - Recipe ID
 * @returns {Object} - { isFavorited, loading, toggleFavorite }
 */
export function useIsFavorited(recipeId) {
  const { favorites, loading: fetchLoading, refetch } = useFavorites();
  const { toggleFavorite: toggle, loading: toggleLoading } = useToggleFavorite();

  const isFavorited = favorites.some(fav => fav.id === recipeId || fav.recipe_id === recipeId || (fav.recipe && (fav.recipe.id === recipeId || fav.recipe.recipe_id === recipeId)));

  const toggleFavorite = async () => {
    const result = await toggle(recipeId);
    if (result) {
      await refetch();
    }
    return result;
  };

  return {
    isFavorited,
    loading: fetchLoading || toggleLoading,
    toggleFavorite,
  };
}

export { getUserIdentifier };
