import { useState, useEffect } from "react";
import { taskService } from "../services/taskService";
import "./ProfileImage.css";
import { AxiosError } from "axios";

const getApiBaseUrl = () => {
	const envUrl = import.meta.env.VITE_API_BASE_URL;
	if (envUrl) {
		return envUrl.replace("/api", "");
	}
	return "http://localhost:5143";
};

const API_BASE_URL = getApiBaseUrl();

export const ProfileImage: React.FC = () => {
	const [imagePath, setImagePath] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadProfileImage();
	}, []);

	const loadProfileImage = async () => {
		try {
			const path = await taskService.getProfileImageUrl();
			setImagePath(path);
		} catch (err) {
			console.error("Failed to load profile image:", err);
		}
	};

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (!file) return;

		// Validate file type
		const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
		if (!validTypes.includes(file.type)) {
			setError("Please select a valid image file (JPEG, PNG, or GIF)");
			return;
		}

		// Validate file size (5MB)
		if (file.size > 5 * 1024 * 1024) {
			setError("File size must be less than 5MB");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const result = await taskService.uploadProfileImage(file);
			setImagePath(result.imagePath);
			setError(null);
		} catch (err: unknown) {
			setError(
				err instanceof AxiosError
					? err.response?.data?.message || "Failed to upload image"
					: "Failed to upload image"
			);
		} finally {
			setLoading(false);
			event.target.value = "";
		}
	};

	const handleDelete = async () => {
		if (!confirm("Are you sure you want to delete your profile image?")) {
			return;
		}

		setLoading(true);
		try {
			await taskService.deleteProfileImage();
			setImagePath(null);
			setError(null);
		} catch (err: unknown) {
			setError(
				err instanceof AxiosError
					? err.response?.data?.message || "Failed to delete image"
					: "Failed to delete image"
			);
			setError("Failed to delete image");
		} finally {
			setLoading(false);
		}
	};

	const imageUrl = imagePath ? `${API_BASE_URL}/${imagePath}` : null;

	return (
		<div className="profile-image-container">
			<div className="profile-image-wrapper">
				{imageUrl ? (
					<img
						src={imageUrl}
						alt="Profile"
						className="profile-image"
					/>
				) : (
					<div className="profile-image-placeholder">
						<span>No Image</span>
					</div>
				)}
			</div>
			<div className="profile-image-actions">
				{imageUrl && (
					<button
						className="delete-button"
						onClick={handleDelete}
						disabled={loading}
						title="Delete profile image">
						🗑
					</button>
				)}
				<label
					className="upload-button"
					title="Upload profile image">
					{loading ? "Uploading..." : "+"}
					<input
						type="file"
						accept="image/jpeg,image/jpg,image/png,image/gif"
						onChange={handleFileChange}
						disabled={loading}
						style={{ display: "none" }}
					/>
				</label>
			</div>
			{error && <div className="error-message">{error}</div>}
		</div>
	);
};
