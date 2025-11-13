/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { getUserProfile, updateAvatar, updateUsername } from '../services/userService';
import { useFavorites, useToggleFavorite } from '../hooks/useFavorites';

export default function ProfilePage({ onRecipeClick }) {
	const [profile, setProfile] = useState(getUserProfile());
	const [editing, setEditing] = useState(false);
	const [usernameValue, setUsernameValue] = useState(profile.username || 'Pengguna');
	const [avatarPreview, setAvatarPreview] = useState(profile.avatar || null);
	const fileInputRef = useRef(null);
	const { favorites, loading: favLoading, error: favError, refetch } = useFavorites();
	const { toggleFavorite, loading: toggleLoading } = useToggleFavorite();

	useEffect(() => {
		const p = getUserProfile();
		setProfile(p);
		setUsernameValue(p.username || 'Pengguna');
		setAvatarPreview(p.avatar || null);
	}, []);

	const handleAvatarSelect = async (file) => {
		if (!file) return;
		const reader = new FileReader();
		reader.onload = async (e) => {
			const base64 = e.target.result;
			const res = updateAvatar(base64);
			if (res && res.success) {
				setProfile(res.data);
				setAvatarPreview(res.data.avatar || null);
			} else {
				alert('Gagal mengunggah avatar');
			}
		};
		reader.readAsDataURL(file);
	};

	const onAvatarChange = (e) => {
		const file = e.target.files && e.target.files[0];
		if (file) {
			handleAvatarSelect(file);
		}
	};

	const clearAvatar = () => {
		const res = updateAvatar(null);
		if (res && res.success) {
			setProfile(res.data);
			setAvatarPreview(null);
		}
	};

	const startEditing = () => setEditing(true);
	const cancelEditing = () => {
		setEditing(false);
		setUsernameValue(profile.username || 'Pengguna');
	};

	const saveUsername = () => {
		const res = updateUsername(usernameValue);
		if (res && res.success) {
			setProfile(res.data);
			setEditing(false);
		} else {
			alert('Gagal menyimpan username');
		}
	};

	const handleRemoveFavorite = async (recipeId) => {
		const result = await toggleFavorite(recipeId);
		if (result) {
			await refetch();
		} else {
			alert('Gagal menghapus favorite');
		}
	};

	// Debug: Log favorites to see the actual data structure
	useEffect(() => {
		console.log('Favorites data:', favorites);
	}, [favorites]);

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-8">
			{/* --- Profil Section --- */}
			<div className="bg-white rounded-2xl shadow-lg p-6">
				<div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 space-y-4 sm:space-y-0">
					<div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shadow-inner">
						{avatarPreview ? (
							<img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
						) : (
							<div className="text-gray-400">No Avatar</div>
						)}
					</div>

					<div className="flex-1 text-center sm:text-left">
						{!editing ? (
							<>
								<h2 className="text-2xl font-semibold text-gray-800">{profile.username || 'Pengguna'}</h2>
								<p className="text-sm text-gray-500">ID: {profile.userId}</p>

								<div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
									<button
										className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
										onClick={() => fileInputRef.current?.click()}
									>
										Unggah Foto
									</button>
									<button
										className="px-4 py-2 rounded-lg border border-blue-400 text-blue-500 hover:bg-blue-50 transition-colors"
										onClick={startEditing}
									>
										Ubah Username
									</button>
									<button
										className="px-4 py-2 rounded-lg border border-red-400 text-red-500 hover:bg-red-50 transition-colors"
										onClick={clearAvatar}
									>
										Hapus Foto
									</button>
								</div>
							</>
						) : (
							<div className="space-y-3">
								<input
									className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
									value={usernameValue}
									onChange={(e) => setUsernameValue(e.target.value)}
								/>
								<div className="flex justify-center sm:justify-start gap-2">
									<button
										className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
										onClick={saveUsername}
									>
										Simpan
									</button>
									<button
										className="px-4 py-2 rounded-lg border border-gray-400 text-gray-600 hover:bg-gray-50 transition-colors"
										onClick={cancelEditing}
									>
										Batal
									</button>
								</div>
							</div>
						)}
					</div>
				</div>

				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					className="hidden"
					onChange={onAvatarChange}
				/>
			</div>

			{/* --- Favorit Section --- */}
			<div className="bg-white rounded-2xl shadow-lg p-6">
				<h3 className="text-xl font-semibold mb-4 text-gray-800">Favorit Anda</h3>

				{favLoading ? (
					<div className="text-gray-500 animate-pulse">Memuat favorit...</div>
				) : favError ? (
					<div className="text-red-500">Terjadi kesalahan: {favError}</div>
				) : !favorites || favorites.length === 0 ? (
					<div className="text-gray-500">Anda belum menandai resep sebagai favorit.</div>
				) : (
					<div className="grid grid-cols-1 gap-4">
						{favorites.map((recipe) => (
							<div
								key={recipe.id || recipe.recipe_id}
								className="flex flex-col sm:flex-row items-center justify-between border rounded-xl p-4 hover:shadow-md transition-shadow"
							>
								<div className="flex items-center space-x-4 mb-3 sm:mb-0">
									<div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
										{recipe.image ? (
											<img src={recipe.image} alt="recipe" className="w-full h-full object-cover" />
										) : (
											<div className="text-gray-400 p-3 text-xs">No Image</div>
										)}
									</div>
									<div>
										<div className="font-medium text-gray-800">
											{recipe.title || recipe.name || 'Untitled Recipe'}
										</div>
										<div className="text-sm text-gray-500">
											{recipe.category || 'makanan'}
										</div>
									</div>
								</div>

								<div className="flex justify-center sm:justify-end gap-2">
									<button
										className="px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm transition-colors"
										onClick={() => onRecipeClick?.(recipe.id || recipe.recipe_id, recipe.category)}
									>
										Buka
									</button>
									<button
										className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm transition-colors disabled:opacity-50"
										onClick={() => handleRemoveFavorite(recipe.id || recipe.recipe_id)}
										disabled={toggleLoading}
									>
										Hapus
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}