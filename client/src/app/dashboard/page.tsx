"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { useProfileStore } from "@/store/profile-store";
import { getMyOrders } from "@/services/order-service";
import { getRestaurant } from "@/services/restaurant-service";
import { getMyNotifications, markNotificationRead, type AppNotification } from "@/services/notification-service";
import { mapMyOrders, mapRestaurantMenuItems } from "@/lib/api-mappers";
import { useFavoritesStore } from "@/store/favorites-store";
import { changePassword, updateSettings } from "@/services/auth-service";

const sections = ["profile", "orders", "addresses", "favorites", "settings"] as const;
type Section = (typeof sections)[number];

export default function UserDashboardPage() {
  const { user, isAuthenticated, setUser, logout } = useAuthStore();
  const addItem = useCartStore((state) => state.addItem);
  const phone = useProfileStore((state) => state.phone);
  const profileImage = useProfileStore((state) => state.profileImage);
  const setPhone = useProfileStore((state) => state.setPhone);
  const setProfileImage = useProfileStore((state) => state.setProfileImage);
  const addresses = useProfileStore((state) => state.addresses);
  const addAddress = useProfileStore((state) => state.addAddress);
  const updateAddress = useProfileStore((state) => state.updateAddress);
  const deleteAddress = useProfileStore((state) => state.deleteAddress);
  const paymentMethods = useProfileStore((state) => state.paymentMethods);
  const addPaymentMethod = useProfileStore((state) => state.addPaymentMethod);
  const removePaymentMethod = useProfileStore((state) => state.removePaymentMethod);
  
  const favoriteItems = useFavoritesStore((state) => state.items);

  const [activeSection, setActiveSection] = useState<Section>("profile");
  const [editingProfile, setEditingProfile] = useState(false);
  const [nameDraft, setNameDraft] = useState(user?.name || "Rahul Sharma");
  const [emailDraft, setEmailDraft] = useState(user?.email || "rahul@gmail.com");
  const [phoneDraft, setPhoneDraft] = useState(phone);
  const [addressType, setAddressType] = useState("Home");
  const [addressDraft, setAddressDraft] = useState("");
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [paymentDraft, setPaymentDraft] = useState("");
  const [orders, setOrders] = useState<Array<{ id: string; orderNumber: number; date: string; amount: number; status: string; items: string[] }>>([]);

  const [changingPassword, setChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState((user as any)?.emailNotifications ?? true);
  const [pushNotifs, setPushNotifs] = useState((user as any)?.pushNotifications ?? true);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      try {
        const [ordersData, menuData, notifsData] = await Promise.all([
          getMyOrders().catch(() => []),
          getRestaurant("jay-malhar-main").catch(() => null),
          getMyNotifications().catch(() => [])
        ]);

        if (ordersData.length) setOrders(mapMyOrders(ordersData));
        if (menuData) setMenuItems(mapRestaurantMenuItems(menuData));
        if (notifsData.length) setNotifications(notifsData);
      } catch (err) {}
    };

    fetchData();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="rounded-[2rem] bg-white p-8 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">User Profile</p>
          <h1 className="mt-2 font-display text-4xl text-brand-900">Sign in to view your profile</h1>
          <p className="mt-4 text-sm leading-7 text-stone-600">Access your order history, saved addresses, favorites, and settings after signing in.</p>
          <Link href="/signin" className="mt-6 inline-block rounded-full bg-brand-500 px-6 py-3 font-semibold text-white">Sign in</Link>
        </div>
      </main>
    );
  }

  function saveProfile() {
    setUser({ ...(user || { id: "guest", role: "CUSTOMER" }), name: nameDraft, email: emailDraft });
    setPhone(phoneDraft);
    setEditingProfile(false);
  }

  function saveAddress() {
    if (!addressDraft.trim()) return;
    if (editingAddressId) {
      updateAddress(editingAddressId, addressType, addressDraft);
    } else {
      addAddress(addressType, addressDraft);
    }
    setAddressDraft("");
    setAddressType("Home");
    setEditingAddressId(null);
  }

  function onProfileImageChange(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_SIZE = 200;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round((height *= MAX_SIZE / width));
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round((width *= MAX_SIZE / height));
              height = MAX_SIZE;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          setProfileImage(canvas.toDataURL("image/jpeg", 0.7));
        };
        img.src = reader.result;
      }
    };
    reader.readAsDataURL(file);
  }

  async function markRead(id: string) {
    await markNotificationRead(id).catch(() => undefined);
    setNotifications((current) => current.map((item) => (item.id === id ? { ...item, isRead: true } : item)));
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    try {
      setPasswordError("");
      const res = await changePassword({ currentPassword, newPassword });
      setPasswordMessage(res.message || "Password updated successfully.");
      setTimeout(() => {
        setChangingPassword(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordMessage("");
      }, 3000);
    } catch (err: any) {
      setPasswordError(err?.response?.data?.message || "Unable to change password.");
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-4 flex items-center lg:hidden">
        <button type="button" onClick={() => setIsSidebarOpen(true)} className="flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-stone-900 shadow-soft">
          <svg className="h-5 w-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          Open Menu
        </button>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[260px,1fr]">
        {isSidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
        
        <aside className={`fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] transform overflow-y-auto bg-white p-6 shadow-2xl transition-transform duration-300 lg:static lg:z-auto lg:w-full lg:translate-x-0 lg:rounded-[2rem] lg:shadow-soft ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <span className="font-display text-xl text-brand-900">Menu</span>
            <button type="button" onClick={() => setIsSidebarOpen(false)} className="rounded-full bg-stone-100 p-2 text-stone-500"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-orange-200 bg-orange-50 text-xl font-bold text-brand-700">
              {profileImage ? <img src={profileImage} alt="Profile" className="h-full w-full object-cover" /> : (user?.name?.slice(0, 1).toUpperCase() || "U")}
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">My Account</p>
              <h2 className="mt-1 font-display text-2xl text-brand-900">{user?.name || "Customer"}</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-2">
            {sections.map((section) => <button key={section} type="button" onClick={() => { setActiveSection(section); setIsSidebarOpen(false); }} className={activeSection === section ? "rounded-2xl bg-brand-500 px-4 py-3 text-left text-sm font-semibold text-white" : "rounded-2xl px-4 py-3 text-left text-sm font-medium text-stone-700 hover:bg-stone-50"}>{labelForSection(section)}</button>)}
            <button type="button" onClick={logout} className="rounded-2xl px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50">Logout</button>
          </div>
        </aside>

        <section className="space-y-6">
          {activeSection === "profile" ? <div className="rounded-[2rem] bg-white p-8 shadow-soft"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Profile Information</p><h1 className="mt-2 font-display text-4xl text-brand-900">Your profile</h1></div><div className="flex gap-3"><button type="button" onClick={() => setEditingProfile((value) => !value)} className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-800">{editingProfile ? "Cancel" : "Edit Profile"}</button><button type="button" onClick={() => { setActiveSection("settings"); setChangingPassword(true); }} className="rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white">Change Password</button></div></div><div className="mt-8 grid gap-6 lg:grid-cols-[220px,1fr]"><div className="rounded-3xl border border-stone-200 p-5"><div className="flex h-40 items-center justify-center overflow-hidden rounded-3xl bg-orange-50 text-4xl font-bold text-brand-700">{profileImage ? <img src={profileImage} alt="Profile" className="h-full w-full object-cover" /> : (user?.name?.slice(0, 1).toUpperCase() || "U")}</div><label className="mt-4 block rounded-full bg-brand-500 px-5 py-3 text-center text-sm font-semibold text-white">Upload Profile Image<input type="file" accept="image/*" className="hidden" onChange={(event) => onProfileImageChange(event.target.files?.[0])} /></label></div><div className="grid gap-4 md:grid-cols-2"><Field label="Name" value={editingProfile ? <input className="w-full rounded-2xl border border-stone-200 px-4 py-3" value={nameDraft} onChange={(event) => setNameDraft(event.target.value)} /> : user?.name || "Rahul Sharma"} /><Field label="Email" value={editingProfile ? <input className="w-full rounded-2xl border border-stone-200 px-4 py-3" value={emailDraft} onChange={(event) => setEmailDraft(event.target.value)} /> : user?.email || "rahul@gmail.com"} /><Field label="Phone" value={editingProfile ? <input className="w-full rounded-2xl border border-stone-200 px-4 py-3" value={phoneDraft} onChange={(event) => setPhoneDraft(event.target.value)} /> : phone} /><Field label="Default Address" value={addresses[0]?.address || "Add your first address"} /></div></div>{editingProfile ? <button type="button" onClick={saveProfile} className="mt-6 rounded-full bg-brand-500 px-6 py-3 font-semibold text-white">Save Profile</button> : null}<div className="mt-8 rounded-3xl bg-orange-50 p-6"><div className="flex items-center justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Notifications</p><h2 className="mt-2 text-2xl font-semibold text-stone-900">Customer timeline</h2></div><p className="text-sm text-stone-500">{notifications.filter((item) => !item.isRead).length} unread</p></div><div className="mt-5 grid gap-3">{notifications.length === 0 ? <div className="rounded-2xl bg-white px-4 py-4 text-sm text-stone-600">No notifications yet.</div> : notifications.slice(0, 5).map((notification) => <div key={notification.id} className={notification.isRead ? "rounded-2xl bg-white px-4 py-4 text-sm text-stone-600" : "rounded-2xl border border-orange-200 bg-white px-4 py-4 text-sm text-stone-700"}><div className="flex items-start justify-between gap-4"><div><p className="font-semibold text-stone-900">{notification.title}</p><p className="mt-1 leading-6">{notification.message}</p><p className="mt-2 text-xs text-stone-500">{new Date(notification.createdAt).toLocaleString("en-GB")}</p></div>{!notification.isRead ? <button type="button" onClick={() => markRead(notification.id)} className="rounded-full bg-stone-900 px-3 py-2 text-xs font-semibold text-white">Mark read</button> : null}</div></div>)}</div></div></div> : null}

          {activeSection === "orders" ? <div className="rounded-[2rem] bg-white p-8 shadow-soft"><p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Order History</p><h1 className="mt-2 font-display text-4xl text-brand-900">Track and reorder</h1><div className="mt-8 overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="text-stone-500"><tr><th className="pb-3">Order ID</th><th className="pb-3">Date</th><th className="pb-3">Amount</th><th className="pb-3">Status</th><th className="pb-3">Action</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id} className="border-t border-stone-100 align-top"><td className="py-4 font-semibold text-stone-900">#{order.orderNumber}</td><td className="py-4 text-stone-700">{order.date}</td><td className="py-4 text-stone-700">{formatCurrency(order.amount)}</td><td className="py-4 text-stone-700">{order.status}</td><td className="py-4"><div className="flex flex-wrap gap-2"><button type="button" onClick={() => window.alert(`Order items: ${order.items.join(", ")}`)} className="rounded-full bg-stone-100 px-3 py-2 text-xs font-semibold text-stone-700">View Details</button><Link href={`/orders/${order.id}`} className="rounded-full bg-orange-50 px-3 py-2 text-xs font-semibold text-brand-700">Track Order</Link><button type="button" onClick={() => {order.items.forEach((itemName) => {const menuItem = menuItems.find((menu) => menu.name === itemName && menu.isAvailable); if (menuItem) {addItem({ id: menuItem.id, name: menuItem.name, price: menuItem.price, quantity: 1 });}});}} className="rounded-full bg-stone-900 px-3 py-2 text-xs font-semibold text-white">Reorder</button></div></td></tr>)}</tbody></table></div></div> : null}

          {activeSection === "addresses" ? <div className="rounded-[2rem] bg-white p-8 shadow-soft"><p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Saved Addresses</p><h1 className="mt-2 font-display text-4xl text-brand-900">Manage delivery locations</h1><div className="mt-8 grid gap-4 md:grid-cols-2">{addresses.map((entry) => <div key={entry.id} className="rounded-3xl border border-stone-200 p-5"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">{entry.type}</p><p className="mt-3 text-sm leading-7 text-stone-700">{entry.address}</p><div className="mt-5 flex gap-3"><button type="button" onClick={() => {setEditingAddressId(entry.id); setAddressType(entry.type); setAddressDraft(entry.address);}} className="rounded-full bg-stone-100 px-4 py-2 text-xs font-semibold text-stone-700">Edit Address</button><button type="button" onClick={() => deleteAddress(entry.id)} className="rounded-full bg-red-50 px-4 py-2 text-xs font-semibold text-red-700">Delete Address</button></div></div>)}</div><div className="mt-8 grid gap-4 rounded-3xl bg-orange-50 p-6 md:grid-cols-[180px,1fr,180px]"><input className="rounded-2xl border border-stone-200 px-4 py-3" value={addressType} onChange={(event) => setAddressType(event.target.value)} placeholder="Home or Work" /><input className="rounded-2xl border border-stone-200 px-4 py-3" value={addressDraft} onChange={(event) => setAddressDraft(event.target.value)} placeholder="Enter address" /><button type="button" onClick={saveAddress} className="rounded-full bg-brand-500 px-5 py-3 font-semibold text-white">{editingAddressId ? "Update Address" : "Add Address"}</button></div></div> : null}

          {activeSection === "favorites" ? <div className="rounded-[2rem] bg-white p-8 shadow-soft"><p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Favorites</p><h1 className="mt-2 font-display text-4xl text-brand-900">Saved food items</h1><div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{favoriteItems.map((item) => <div key={item.id} className="rounded-3xl border border-stone-200 p-5"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">Favorite</p><h2 className="mt-3 text-2xl font-semibold text-stone-900">{item.name}</h2><p className="mt-2 text-sm leading-6 text-stone-600">{item.description}</p><p className="mt-4 text-sm font-medium text-stone-700">{formatCurrency(item.price)}</p><button type="button" onClick={() => addItem({ id: item.id, name: item.name, price: item.price, quantity: 1 })} className="mt-5 rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white">Add to Cart</button></div>)}</div></div> : null}

          {activeSection === "settings" ? <div className="rounded-[2rem] bg-white p-8 shadow-soft"><p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Settings</p><h1 className="mt-2 font-display text-4xl text-brand-900">Payments and account tools</h1><div className="mt-8 grid gap-6 xl:grid-cols-[1fr,1fr]"><div className="rounded-3xl bg-orange-50 p-6"><h2 className="text-2xl font-semibold text-stone-900">Saved Payment Methods</h2><div className="mt-5 space-y-3">{paymentMethods.map((method) => <div key={method.id} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3"><span className="text-sm text-stone-700">{method.label}</span><button type="button" onClick={() => removePaymentMethod(method.id)} className="text-xs font-semibold text-red-600">Remove</button></div>)}</div><div className="mt-4 flex gap-3"><input className="flex-1 rounded-2xl border border-stone-200 px-4 py-3" value={paymentDraft} onChange={(event) => setPaymentDraft(event.target.value)} placeholder="Add payment method" /><button type="button" onClick={() => {if (!paymentDraft.trim()) return; addPaymentMethod(paymentDraft); setPaymentDraft("");}} className="rounded-full bg-brand-500 px-5 py-3 font-semibold text-white">Add</button></div></div><div className="grid gap-6"><div className="rounded-3xl bg-stone-50 p-6"><h2 className="text-2xl font-semibold text-stone-900">Account Actions</h2><div className="mt-5 grid gap-3">{changingPassword ? <form onSubmit={handlePasswordChange} className="grid gap-3 rounded-2xl border border-stone-200 p-4"><input type="password" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="rounded-2xl border border-stone-200 px-4 py-2 text-sm" required /><input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="rounded-2xl border border-stone-200 px-4 py-2 text-sm" required /><input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="rounded-2xl border border-stone-200 px-4 py-2 text-sm" required />{passwordError && <p className="text-xs text-red-600">{passwordError}</p>}{passwordMessage && <p className="text-xs text-green-700">{passwordMessage}</p>}<div className="flex gap-2"><button type="submit" className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white">Save</button><button type="button" onClick={() => setChangingPassword(false)} className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800">Cancel</button></div></form> : <button type="button" onClick={() => setChangingPassword(true)} className="rounded-full border border-stone-300 px-5 py-3 text-left text-sm font-semibold text-stone-800">Change Password</button>}<button type="button" onClick={logout} className="rounded-full bg-red-50 px-5 py-3 text-left text-sm font-semibold text-red-700">Logout</button></div></div><div className="rounded-3xl bg-white border border-stone-200 p-6"><h2 className="text-xl font-semibold text-stone-900">Notification Preferences</h2><div className="mt-5 space-y-4"><label className="flex items-center gap-3"><input type="checkbox" checked={emailNotifs} onChange={async (e) => {setEmailNotifs(e.target.checked); await updateSettings({ emailNotifications: e.target.checked }).catch(()=>{});}} className="h-5 w-5 rounded border-stone-300 text-brand-600 focus:ring-brand-600" /><span className="text-sm font-medium text-stone-700">Receive Email Alerts</span></label><label className="flex items-center gap-3"><input type="checkbox" checked={pushNotifs} onChange={async (e) => {setPushNotifs(e.target.checked); await updateSettings({ pushNotifications: e.target.checked }).catch(()=>{});}} className="h-5 w-5 rounded border-stone-300 text-brand-600 focus:ring-brand-600" /><span className="text-sm font-medium text-stone-700">Push Notifications (Browser WebSockets)</span></label></div></div></div></div></div> : null}
        </section>
      </div>
    </main>
  );
}

function labelForSection(section: Section) {
  if (section === "profile") return "My Profile";
  if (section === "orders") return "My Orders";
  if (section === "addresses") return "Saved Addresses";
  if (section === "favorites") return "Favorites";
  return "Settings";
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="rounded-3xl border border-stone-200 p-5"><p className="text-sm text-stone-500">{label}</p><div className="mt-3 text-base text-stone-900">{value}</div></div>;
}
