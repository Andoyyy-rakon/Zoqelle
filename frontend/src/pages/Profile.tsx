import { useEffect, useRef, useState } from 'react';
import { User, Mail, Phone, MapPin, Loader2, Save, ShieldCheck, HeartHandshake, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export default function Profile() {
  const { profile, user, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (profile && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
      });
      setAvatarUrl(profile.avatar_url || null);
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profile updated successfully');
      setIsEditing(false);
      await refreshProfile();
    } catch (err) {
      console.error('Profile update error:', err);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
      });
    }
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-surface" style={{ fontFamily: 'var(--font-family-body)' }}>
      <section className="py-10 md:py-16 px-4 md:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary block mb-1">
              Account Management
            </span>
            <h1 className="text-3xl md:text-4xl text-on-surface"
              style={{ fontFamily: 'var(--font-family-display)', fontWeight: 600 }}
            >
              My Profile
            </h1>
          </div>

          {/* Profile Card Header */}
          <div className="bg-surface-bright rounded-2xl border border-outline-variant/80 p-6 md:p-8 mb-8 animate-slide-up">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative w-20 h-20 flex-shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={formData.name || 'Profile'}
                    className="w-full h-full rounded-full object-cover border-2 border-outline-variant"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-surface-container flex items-center justify-center border-2 border-outline-variant text-primary">
                    <User className="h-10 w-10 text-accent-gold" />
                  </div>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-semibold text-on-surface"
                  style={{ fontFamily: 'var(--font-family-display)' }}
                >
                  {formData.name || 'Zoqelle Patron'}
                </h2>
                <p className="mt-1 text-sm text-on-surface-variant">
                  {user.email}
                </p>
                <span className="mt-3 px-3 py-1 inline-flex items-center text-[10px] font-semibold uppercase tracking-[0.14em] text-on-primary bg-primary rounded-full">
                  {profile?.role === 'admin' ? 'Administrator' : 'Valued Patron'}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="bg-surface-bright rounded-2xl border border-outline-variant/80 p-6 md:p-8 animate-slide-up">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant/60">
              <h2 className="text-lg font-semibold text-on-surface"
                style={{ fontFamily: 'var(--font-family-display)' }}
              >
                Personal Information
              </h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-accent-gold border border-accent-gold rounded-md hover:bg-accent-gold hover:text-white transition-colors focus-ring cursor-pointer"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-on-surface border border-outline-variant rounded-md hover:bg-surface-container transition-colors focus-ring"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-on-primary bg-primary rounded-md transition-colors disabled:opacity-50 focus-ring cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-3.5 w-3.5" />
                        Save
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Full Name <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant/70" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant text-on-surface focus:outline-none focus:border-accent-gold transition-colors text-sm disabled:opacity-60 disabled:bg-surface-container focus-ring"
                      style={{ borderRadius: 'var(--radius-md)' }}
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant/70" />
                    <input
                      type="email"
                      id="email"
                      value={user.email || ''}
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant text-on-surface-variant text-sm cursor-not-allowed opacity-70"
                      style={{ borderRadius: 'var(--radius-md)' }}
                      placeholder="Email cannot be changed"
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-on-surface-variant/70">Email address is managed by authentication provider.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="phone" className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant/70" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant text-on-surface focus:outline-none focus:border-accent-gold transition-colors text-sm disabled:opacity-60 disabled:bg-surface-container focus-ring"
                      style={{ borderRadius: 'var(--radius-md)' }}
                      placeholder="+63 9XX XXX XXXX"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="address" className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Default Delivery Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-on-surface-variant/70" />
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={3}
                      className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant text-on-surface focus:outline-none focus:border-accent-gold transition-colors text-sm disabled:opacity-60 disabled:bg-surface-container resize-none focus-ring"
                      style={{ borderRadius: 'var(--radius-md)' }}
                      placeholder="Complete address including barangay, city, province"
                    />
                  </div>
                </div>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-outline-variant/60 grid grid-cols-3 gap-4 text-xs text-on-surface-variant">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-accent-gold flex-shrink-0" strokeWidth={1.75} />
                <span>Account Protection</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="h-4 w-4 text-accent-gold flex-shrink-0" strokeWidth={1.75} />
                <span>Privacy First</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-accent-gold flex-shrink-0" strokeWidth={1.75} />
                <span>Saved Shipping Info</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}