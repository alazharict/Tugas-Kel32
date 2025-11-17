/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateAvatar, updateUsername } from '../services/userService';
import { useFavorites, useToggleFavorite } from '../hooks/useFavorites';
import { Clock, Star, ChefHat, Trash2, Eye } from 'lucide-react';

export default function ProfilePage({ onRecipeClick }) {
	const navigate = useNavigate();
	const [profile, setProfile] = useState(getUserProfile());
	const [editing, setEditing] = useState(false);
	const [usernameValue, setUsernameValue] = useState(profile.username || 'Pengguna');
	const [avatarPreview, setAvatarPreview] = useState(profile.avatar || null);
	const fileInputRef = useRef(null);
	const { favorites, loading: favLoading, error: favError, refetch } = useFavorites();
	const { toggleFavorite, loading: toggleLoading } = useToggleFavorite();

	// Animation states
	const [visibleCards, setVisibleCards] = useState(new Set());
	const cardRefs = useRef([]);

	useEffect(() => {
		const p = getUserProfile();
		setProfile(p);
		setUsernameValue(p.username || 'Pengguna');
		setAvatarPreview(p.avatar || null);
	}, []);

	// Animation observer
	useEffect(() => {
		cardRefs.current = cardRefs.current.slice(0, favorites?.length || 0);
		
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const index = parseInt(entry.target.dataset.index);
					setTimeout(() => {
						setVisibleCards(prev => new Set(prev).add(index));
					}, (index % 3) * 150);
				}
			});
		}, { threshold: 0.1 });

		cardRefs.current.forEach((ref, index) => {
			if (ref) {
				ref.dataset.index = index;
				observer.observe(ref);
			}
		});

		return () => {
			observer.disconnect();
		};
	}, [favorites]);

	// Debug favorites data
	useEffect(() => {
		console.log('Favorites data:', favorites);
	}, [favorites]);

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

	// Helper function to normalize recipe data
	const normalizeRecipeData = (recipe) => {
		if (!recipe) return null;

		return {
			id: recipe.id || recipe.recipe_id || recipe._id,
			title: recipe.title || recipe.name || recipe.recipe_title || 'Untitled Recipe',
			image: recipe.image || recipe.image_url || recipe.thumbnail,
			category: recipe.category || recipe.type || 'makanan',
			prep_time: recipe.prep_time || recipe.cooking_time || recipe.duration || 0,
			difficulty: recipe.difficulty || recipe.level || 'Sedang',
			average_rating: recipe.average_rating || recipe.rating || recipe.score || 0
		};
	};

	// Check if we have valid favorites data
	const hasFavorites = favorites && Array.isArray(favorites) && favorites.length > 0;
	const normalizedFavorites = hasFavorites 
		? favorites.map(recipe => normalizeRecipeData(recipe)).filter(Boolean)
		: [];

	return (
		<div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50 pb-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* --- Profil Section --- */}
				<div className="bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl md:rounded-3xl shadow-lg md:shadow-2xl shadow-blue-500/5 p-6 mb-8">
					<div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 space-y-4 sm:space-y-0">
						<div className="relative">
							<div className="w-28 h-28 rounded-full overflow-hidden bg-white/15 backdrop-blur-xl border border-white/25 flex items-center justify-center shadow-lg">
								{avatarPreview ? (
									<img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
								) : (
									<div className="text-gray-400 text-4xl">👤</div>
								)}
							</div>
						</div>

						<div className="flex-1 text-center sm:text-left">
							{!editing ? (
								<>
									<h2 className="text-3xl font-bold text-slate-800 mb-2">{profile.username || 'Pengguna'}</h2>
									<p className="text-slate-600 mb-4">Pecinta Kuliner Jawa</p>

									<div className="flex flex-wrap justify-center sm:justify-start gap-3">
										<button
											className="px-5 py-2.5 bg-white/15 backdrop-blur-xl border border-white/25 text-slate-700 hover:bg-white/30 rounded-xl transition-all duration-500 shadow-lg hover:shadow-xl flex items-center gap-2"
											onClick={() => fileInputRef.current?.click()}
										>
											📷 Unggah Foto
										</button>
										<button
											className="px-5 py-2.5 bg-white/15 backdrop-blur-xl border border-white/25 text-slate-700 hover:bg-white/30 rounded-xl transition-all duration-500 shadow-lg hover:shadow-xl flex items-center gap-2"
											onClick={startEditing}
										>
											✏️ Ubah Username
										</button>
										<button
											className="px-5 py-2.5 bg-white/15 backdrop-blur-xl border border-white/25 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-500 shadow-lg hover:shadow-xl flex items-center gap-2"
											onClick={clearAvatar}
										>
											🗑️ Hapus Foto
										</button>
									</div>
								</>
							) : (
								<div className="space-y-4">
									<input
										className="bg-white/15 backdrop-blur-xl border border-white/25 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-500 text-slate-800 placeholder-slate-500"
										value={usernameValue}
										onChange={(e) => setUsernameValue(e.target.value)}
										placeholder="Masukkan username baru"
									/>
									<div className="flex justify-center sm:justify-start gap-3">
										<button
											className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-500 shadow-lg hover:shadow-xl flex items-center gap-2"
											onClick={saveUsername}
										>
											✅ Simpan
										</button>
										<button
											className="px-5 py-2.5 bg-white/15 backdrop-blur-xl border border-white/25 text-slate-700 hover:bg-white/30 rounded-xl transition-all duration-500 shadow-lg hover:shadow-xl flex items-center gap-2"
											onClick={cancelEditing}
										>
											❌ Batal
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
				<section>
					<div className="text-center mb-8">
						<h1 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4">
							Resep Favorit Anda
						</h1>
						<p className="text-slate-600 max-w-2xl mx-auto">
							Koleksi resep yang telah Anda tandai sebagai favorit
						</p>
					</div>

					{favLoading ? (
						<div className="text-center py-12">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
							<p className="mt-4 text-slate-600">Memuat resep favorit...</p>
						</div>
					) : favError ? (
						<div className="text-center py-12">
							<div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
								<p className="text-red-600 font-semibold mb-2">Terjadi Kesalahan</p>
								<p className="text-red-500 text-sm">{favError}</p>
							</div>
						</div>
					) : normalizedFavorites.length === 0 ? (
						<div className="text-center py-16">
							<div className="text-6xl mb-4">🌟</div>
							<p className="text-slate-600 text-lg mb-2">Belum ada resep favorit</p>
							<p className="text-slate-500">Tambahkan resep ke favorit untuk melihatnya di sini</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
							{normalizedFavorites.map((recipe, index) => (
								<div 
									key={recipe.id} 
									ref={el => cardRefs.current[index] = el}
									className={`group transform transition-all duration-700 ${
										visibleCards.has(index) 
											? 'translate-y-0 opacity-100' 
											: 'translate-y-8 opacity-0'
									}`}
								>
									<div className="relative bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl md:rounded-3xl overflow-hidden shadow-lg md:shadow-2xl shadow-blue-500/5 hover:shadow-blue-500/15 transition-all duration-500 group-hover:scale-105 group-hover:bg-white/20">
										<div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
										
										{/* Recipe Image */}
										<div className="relative h-32 md:h-56 overflow-hidden">
											{recipe.image ? (
												<img 
													src={recipe.image}
													alt={recipe.title}
													className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
												/>
											) : (
												<div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
													<div className="text-gray-400 text-4xl">🍳</div>
												</div>
											)}
											<div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
											
											{/* Remove Favorite Button */}
											<div className="absolute top-3 right-3 z-10">
												<button
													onClick={(e) => {
														e.stopPropagation();
														handleRemoveFavorite(recipe.id);
													}}
													disabled={toggleLoading}
													className="bg-white/90 backdrop-blur-sm hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
													title="Hapus dari favorit"
												>
													<Trash2 className="w-3 h-3 md:w-4 md:h-4" />
												</button>
											</div>
										</div>

										{/* Recipe Content */}
										<div className="relative z-10 p-4 md:p-8">
											<div className="flex items-center justify-between mb-3 md:mb-4">
												<span className="text-xs font-semibold text-blue-700 bg-blue-100/90 px-2 md:px-3 py-1 md:py-1.5 rounded-full capitalize">
													{recipe.category}
												</span>
												{recipe.average_rating > 0 && (
													<div className="flex items-center space-x-1 bg-white/90 px-2 py-1 rounded-full">
														<Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-current" />
														<span className="text-xs md:text-sm font-semibold text-slate-700">
															{recipe.average_rating.toFixed(1)}
														</span>
													</div>
												)}
											</div>

											<h3 className="font-bold text-slate-800 mb-3 md:mb-4 text-base md:text-xl group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
												{recipe.title}
											</h3>

											<div className="flex items-center justify-between text-xs md:text-sm text-slate-600">
												<div className="flex items-center space-x-1 md:space-x-2 bg-white/70 px-2 md:px-3 py-1 md:py-2 rounded-full">
													<Clock className="w-3 h-3 md:w-4 md:h-4" />
													<span className="font-medium">{recipe.prep_time} menit</span>
												</div>
												<div className="flex items-center space-x-1 md:space-x-2 bg-white/70 px-2 md:px-3 py-1 md:py-2 rounded-full">
													<ChefHat className="w-3 h-3 md:w-4 md:h-4" />
													<span className="font-medium">{recipe.difficulty}</span>
												</div>
											</div>

											{/* View Recipe Button */}
											<button
												onClick={() => {
													if (onRecipeClick) return onRecipeClick(recipe.id, recipe.category);
													navigate(`/recipe/${recipe.id}`);
												}}
												className="w-full mt-4 bg-white/15 backdrop-blur-xl border border-white/25 text-slate-700 hover:bg-white/30 py-2.5 rounded-xl font-semibold transition-all duration-500 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group/btn"
											>
												<Eye className="w-4 h-4" />
												Lihat Resep
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</section>
			</div>
		</div>
	);
}