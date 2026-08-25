"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "@/lib/api";

import { ProfileDetails } from "./_components/ProfileDetails";
import { ChangePassword } from "./_components/ChangePassword";
import { DangerZone } from "./_components/DangerZone";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Profile state
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    professional_background: "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  
  // Password state
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  
  // Delete state
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await fetchAPI("/api/v1/users/me");
        setProfileForm({
          name: data.name || "",
          email: data.email || "",
          professional_background: data.professional_background || "",
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await fetchAPI("/api/v1/users/me", {
        method: "PATCH",
        body: JSON.stringify(profileForm),
      });
      alert("Profile updated successfully!");
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    setPasswordError("");
  };

  const handleSavePassword = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError("New passwords do not match.");
      return;
    }
    setIsSavingPassword(true);
    try {
      await fetchAPI("/api/v1/users/password", {
        method: "PATCH",
        body: JSON.stringify({
          old_password: passwordForm.old_password,
          new_password: passwordForm.new_password,
        }),
      });
      alert("Password updated successfully!");
      setPasswordForm({ old_password: "", new_password: "", confirm_password: "" });
    } catch (err: any) {
      setPasswordError(err.message || "Failed to update password");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you absolutely sure you want to delete your account? This will permanently delete all your Ideas, Business Model Canvases, and Feedbacks. This action CANNOT be undone."
    );
    if (!confirmed) return;
    
    setIsDeleting(true);
    try {
      await fetchAPI("/api/v1/users/me", {
        method: "DELETE",
      });
      router.push("/login");
    } catch (err: any) {
      alert(err.message || "Failed to delete account");
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 text-[14px] font-medium">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-[calc(100vh-4rem)] pt-8 pb-32">
      <div className="max-w-3xl mx-auto px-6 sm:px-8">
        
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Profile</h1>
          <p className="text-slate-500 mt-2">Manage your personal information and security settings.</p>
        </div>

        <div className="flex flex-col gap-8">
          
          <ProfileDetails
            profileForm={profileForm}
            isSavingProfile={isSavingProfile}
            handleProfileChange={handleProfileChange}
            handleSaveProfile={handleSaveProfile}
          />

          <ChangePassword
            passwordForm={passwordForm}
            isSavingPassword={isSavingPassword}
            passwordError={passwordError}
            handlePasswordChange={handlePasswordChange}
            handleSavePassword={handleSavePassword}
          />

          <DangerZone
            isDeleting={isDeleting}
            handleDeleteAccount={handleDeleteAccount}
          />

        </div>
      </div>
    </div>
  );
}
