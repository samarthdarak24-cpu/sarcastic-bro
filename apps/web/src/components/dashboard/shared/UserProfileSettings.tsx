"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import api from "@/services/api";
import { useTranslation } from "react-i18next";
import { Camera, Save, Phone, MapPin, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function UserProfileSettings() {
  const { user, setUser } = useAuthStore();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res: any = await api.put("/user/profile", formData);
      if (res.success) {
        setUser({ ...user!, ...res.data });
        showToast(t("save_changes") + " Successful");
      }
    } catch (error) {
      showToast("Error updating profile");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const data = new FormData();
      data.append("image", file);

      try {
        setIsUploading(true);
        const res: any = await api.post("/user/upload-photo", data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        
        if (res.success) {
          setUser({ ...user!, avatarUrl: res.data.avatarUrl });
          showToast("Photo updated");
        }
      } catch (error) {
        console.error("Upload error", error);
        showToast("Upload failed");
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 animate-fade-in relative text-neut-900">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-10 right-10 z-50 bg-brand-primary text-white px-6 py-3 rounded-2xl shadow-xl font-bold transition-all">
          {toastMessage}
        </div>
      )}

      <Card className="border-none shadow-startup-soft rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-xl">
        <div className="h-32 bg-startup-gradient" />
        <CardContent className="p-8 md:p-12 -mt-16">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div 
                className="relative h-32 w-32 rounded-[2rem] bg-white border-4 border-white shadow-startup-medium flex items-center justify-center overflow-hidden cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-neut-100 flex items-center justify-center text-4xl font-black text-brand-primary">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div className="absolute inset-0 bg-neut-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   {isUploading ? <Loader2 className="animate-spin text-white" size={24} /> : <Camera className="text-white" size={24} />}
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
              <p className="text-xs font-bold uppercase text-brand-primary mt-4 tracking-widest">{t("change_photo")}</p>
            </div>

            {/* Form Section */}
            <div className="flex-1 space-y-8 w-full">
              <div className="space-y-1 pb-4 border-b border-neut-100">
                <h2 className="text-3xl font-black tracking-tight">{t("personal_info")}</h2>
                <p className="text-neut-500 font-medium">Update your profile details and contact information.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neut-500 uppercase tracking-widest">{t("personal_info")} - Name</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neut-400"><User size={18} /></div>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full h-12 pl-12 pr-4 rounded-xl border border-neut-200 bg-neut-50 focus:bg-white focus:border-brand-primary outline-none transition-all font-bold text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-neut-500 uppercase tracking-widest">{t("phone")}</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neut-400"><Phone size={18} /></div>
                    <input 
                      type="text" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full h-12 pl-12 pr-4 rounded-xl border border-neut-200 bg-neut-50 focus:bg-white focus:border-brand-primary outline-none transition-all font-bold text-sm"
                      placeholder="+91..."
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-neut-500 uppercase tracking-widest">{t("address")}</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neut-400"><MapPin size={18} /></div>
                    <input 
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full h-12 pl-12 pr-4 rounded-xl border border-neut-200 bg-neut-50 focus:bg-white focus:border-brand-primary outline-none transition-all font-bold text-sm"
                      placeholder="Street, City, State..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  variant="gradient"
                  className="h-12 px-8 rounded-xl font-black shadow-lg shadow-brand-primary/20 gap-2"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  {t("update")}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
