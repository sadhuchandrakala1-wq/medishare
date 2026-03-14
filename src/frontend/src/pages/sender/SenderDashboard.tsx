import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  CheckCircle,
  LogOut,
  MapPin,
  Package,
  Pencil,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { type Listing, useApp } from "../../context/AppContext";

type EditState = {
  medicineName: string;
  quantity: string;
  price: string;
  discountPercent: number;
  isFree: boolean;
  location: string;
};

export default function SenderDashboard() {
  const navigate = useNavigate();
  const {
    currentUser,
    listings,
    bookings,
    addListing,
    updateListing,
    deleteListing,
    updateBookingStatus,
    logout,
  } = useApp();

  const [activeTab, setActiveTab] = useState("add");

  // Add form state
  const [medicineName, setMedicineName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isFree, setIsFree] = useState(false);
  const [location, setLocation] = useState(currentUser?.location || "");
  const [submitting, setSubmitting] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);

  const myListings = currentUser
    ? listings.filter((l) => l.senderId === currentUser.id)
    : [];

  const myBookingRequests = currentUser
    ? bookings.filter((b) => myListings.some((l) => l.id === b.listingId))
    : [];

  async function handleAddListing(e: React.FormEvent) {
    e.preventDefault();
    if (!medicineName || !quantity) {
      toast.error("Medicine name and quantity are required");
      return;
    }
    if (!isFree && !price) {
      toast.error('Please set a price or toggle "List for Free"');
      return;
    }
    if (!currentUser) {
      navigate({ to: "/" });
      return;
    }

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 400));
    addListing({
      senderId: currentUser.id,
      senderName: currentUser.name,
      medicineName,
      quantity: Number.parseInt(quantity) || 0,
      price: isFree ? 0 : Number.parseFloat(price) || 0,
      discountPercent: isFree ? 0 : discountPercent,
      isFree,
      location: location || currentUser.location,
      active: true,
    });
    setSubmitting(false);
    toast.success(`${medicineName} listed successfully!`);
    setMedicineName("");
    setQuantity("");
    setPrice("");
    setDiscountPercent(0);
    setIsFree(false);
    setActiveTab("listings");
  }

  function startEdit(listing: Listing) {
    setEditingId(listing.id);
    setEditState({
      medicineName: listing.medicineName,
      quantity: String(listing.quantity),
      price: String(listing.price),
      discountPercent: listing.discountPercent,
      isFree: listing.isFree,
      location: listing.location,
    });
  }

  function saveEdit() {
    if (!editingId || !editState) return;
    updateListing(editingId, {
      medicineName: editState.medicineName,
      quantity: Number.parseInt(editState.quantity) || 0,
      price: editState.isFree ? 0 : Number.parseFloat(editState.price) || 0,
      discountPercent: editState.isFree ? 0 : editState.discountPercent,
      isFree: editState.isFree,
      location: editState.location,
    });
    toast.success("Listing updated!");
    setEditingId(null);
    setEditState(null);
  }

  function handleDelete(id: string, name: string) {
    deleteListing(id);
    toast.success(`${name} removed from listings.`);
  }

  const statusColors: Record<string, string> = {
    pending: "bg-warning/20 text-warning-foreground border-warning/30",
    accepted: "bg-success/20 text-success border-success/30",
    declined: "bg-destructive/20 text-destructive border-destructive/30",
    completed: "bg-primary/20 text-primary border-primary/30",
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/assets/generated/medishare-logo-transparent.dim_200x200.png"
              alt="MEDISHARE"
              className="w-7 h-7 rounded-lg"
            />
            <span className="font-display font-bold text-primary text-sm">
              MEDISHARE
            </span>
            <Badge
              variant="outline"
              className="text-xs ml-1 border-accent/50 text-accent"
            >
              Sender
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {currentUser && (
              <span className="text-sm text-muted-foreground hidden sm:block">
                {currentUser.name}
              </span>
            )}

            <button
              type="button"
              className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground"
              title="Profile"
            >
              <User className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                logout();
                navigate({ to: "/" });
              }}
              className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        {currentUser && (
          <div className="mb-5">
            <h2 className="font-display font-bold text-xl">Sender Dashboard</h2>
            <p className="text-muted-foreground text-sm mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {currentUser.location}
            </p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            {
              label: "Listings",
              value: myListings.length,
              icon: Package,
              color: "text-primary",
            },
            {
              label: "Requests",
              value: myBookingRequests.length,
              icon: ShoppingBag,
              color: "text-accent",
            },
            {
              label: "Pending",
              value: myBookingRequests.filter((b) => b.status === "pending")
                .length,
              icon: Activity,
              color: "text-warning",
            },
          ].map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="bg-card rounded-xl border border-border p-3 text-center shadow-xs"
            >
              <Icon className={`w-5 h-5 ${color} mx-auto mb-1`} />
              <div className="text-xl font-display font-bold">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-5 w-full">
            <TabsTrigger
              data-ocid="sender.add.tab"
              value="add"
              className="flex-1 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Medicine
            </TabsTrigger>
            <TabsTrigger
              data-ocid="sender.listings.tab"
              value="listings"
              className="flex-1 flex items-center gap-1.5"
            >
              <Package className="w-3.5 h-3.5" /> My Listings
              {myListings.length > 0 && (
                <span className="ml-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {myListings.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              data-ocid="sender.requests.tab"
              value="requests"
              className="flex-1 flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Requests
              {myBookingRequests.filter((b) => b.status === "pending").length >
                0 && (
                <span className="ml-1 bg-warning text-warning-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {
                    myBookingRequests.filter((b) => b.status === "pending")
                      .length
                  }
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Add Medicine Form */}
          <TabsContent value="add">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border p-5 shadow-xs"
            >
              <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" />
                Add New Medicine Listing
              </h3>
              <form onSubmit={handleAddListing} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="med-name">Medicine Name *</Label>
                  <Input
                    id="med-name"
                    data-ocid="sender.medicine_input"
                    placeholder="e.g. Paracetamol 500mg"
                    value={medicineName}
                    onChange={(e) => setMedicineName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="med-qty">Available Quantity *</Label>
                  <Input
                    id="med-qty"
                    type="number"
                    min="1"
                    placeholder="e.g. 30"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <div className="font-medium text-sm">List for Free</div>
                    <div className="text-xs text-muted-foreground">
                      Donors offer medicine at no cost
                    </div>
                  </div>
                  <Switch
                    data-ocid="sender.free_toggle"
                    checked={isFree}
                    onCheckedChange={(v) => {
                      setIsFree(v);
                      if (v) {
                        setPrice("0");
                        setDiscountPercent(0);
                      }
                    }}
                  />
                </div>

                {!isFree && (
                  <>
                    <div className="space-y-1.5">
                      <Label htmlFor="med-price">Price per Unit (₹)</Label>
                      <Input
                        id="med-price"
                        data-ocid="sender.price_input"
                        type="number"
                        min="0"
                        placeholder="e.g. 150"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Discount</Label>
                        <span className="text-sm font-semibold text-primary">
                          {discountPercent}%
                        </span>
                      </div>
                      <Slider
                        data-ocid="sender.discount_input"
                        min={0}
                        max={100}
                        step={5}
                        value={[discountPercent]}
                        onValueChange={([v]) => setDiscountPercent(v)}
                        className="cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="med-loc">Location</Label>
                  <Input
                    id="med-loc"
                    placeholder="e.g. Koramangala, Bangalore"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                {/* Summary */}
                <div className="bg-secondary rounded-lg p-3 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Medicine:</span>
                    <span className="font-medium">{medicineName || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium">
                      {isFree ? (
                        <span className="text-success">FREE</span>
                      ) : price ? (
                        `₹${price}`
                      ) : (
                        "—"
                      )}
                    </span>
                  </div>
                  {!isFree && discountPercent > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        After discount:
                      </span>
                      <span className="font-semibold text-primary">
                        ₹
                        {(
                          Number.parseFloat(price || "0") *
                          (1 - discountPercent / 100)
                        ).toFixed(0)}
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  data-ocid="sender.submit_button"
                  type="submit"
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting ? "Adding..." : "Add Listing"}
                </Button>
              </form>
            </motion.div>
          </TabsContent>

          {/* My Listings */}
          <TabsContent value="listings">
            {myListings.length === 0 ? (
              <div
                data-ocid="sender.listings.empty_state"
                className="text-center py-14"
              >
                <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No listings yet.</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => setActiveTab("add")}
                >
                  Add Your First Medicine
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {myListings.map((listing, i) => (
                  <motion.div
                    key={listing.id}
                    data-ocid={`sender.listings.item.${i + 1}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card rounded-xl border border-border p-4 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">
                            {listing.medicineName}
                          </h3>
                          {listing.isFree && (
                            <span className="free-badge">FREE</span>
                          )}
                          {!listing.isFree && listing.discountPercent > 0 && (
                            <span className="discount-badge">
                              {listing.discountPercent}% OFF
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Package className="w-3 h-3" /> Qty:{" "}
                            {listing.quantity}
                          </span>
                          {!listing.isFree && (
                            <span className="flex items-center gap-1">
                              <Tag className="w-3 h-3" /> ₹{listing.price}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <ShoppingBag className="w-3 h-3" />{" "}
                            {listing.requestCount} requests
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {listing.location}
                        </div>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          data-ocid={`sender.listing_edit_button.${i + 1}`}
                          onClick={() => startEdit(listing)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                          data-ocid={`sender.listing_delete_button.${i + 1}`}
                          onClick={() =>
                            handleDelete(listing.id, listing.medicineName)
                          }
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Booking Requests */}
          <TabsContent value="requests">
            {myBookingRequests.length === 0 ? (
              <div
                data-ocid="sender.requests.empty_state"
                className="text-center py-14"
              >
                <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">
                  No booking requests yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {myBookingRequests.map((booking, i) => (
                  <motion.div
                    key={booking.id}
                    data-ocid={`sender.requests.item.${i + 1}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card rounded-xl border border-border p-4 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm">
                            {booking.customerName}
                          </span>
                          <Badge
                            variant="outline"
                            className={`capitalize text-xs border ${statusColors[booking.status] || ""}`}
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {booking.medicineName} · Qty:{" "}
                          {booking.quantityRequested}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Payment:{" "}
                          {booking.paymentMethod === "free"
                            ? "Free"
                            : `₹${booking.totalPrice.toFixed(0)} online`}
                        </div>
                      </div>
                      {booking.status === "pending" && (
                        <div className="flex gap-1.5 flex-shrink-0">
                          <Button
                            size="sm"
                            className="h-8 px-3 bg-success hover:bg-success/90 text-success-foreground"
                            data-ocid={`sender.request_accept_button.${i + 1}`}
                            onClick={() => {
                              updateBookingStatus(booking.id, "accepted");
                              toast.success("Request accepted!");
                            }}
                          >
                            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                            data-ocid={`sender.request_decline_button.${i + 1}`}
                            onClick={() => {
                              updateBookingStatus(booking.id, "declined");
                              toast.error("Request declined.");
                            }}
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1" /> Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit Dialog */}
      <AnimatePresence>
        {editingId && editState && (
          <Dialog
            open
            onOpenChange={() => {
              setEditingId(null);
              setEditState(null);
            }}
          >
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle className="font-display">Edit Listing</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="space-y-1.5">
                  <Label>Medicine Name</Label>
                  <Input
                    value={editState.medicineName}
                    onChange={(e) =>
                      setEditState({
                        ...editState,
                        medicineName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={editState.quantity}
                    onChange={(e) =>
                      setEditState({ ...editState, quantity: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <span className="text-sm font-medium">Free</span>
                  <Switch
                    checked={editState.isFree}
                    onCheckedChange={(v) =>
                      setEditState({ ...editState, isFree: v })
                    }
                  />
                </div>
                {!editState.isFree && (
                  <>
                    <div className="space-y-1.5">
                      <Label>Price (₹)</Label>
                      <Input
                        type="number"
                        value={editState.price}
                        onChange={(e) =>
                          setEditState({ ...editState, price: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Discount</Label>
                        <span className="text-sm font-semibold text-primary">
                          {editState.discountPercent}%
                        </span>
                      </div>
                      <Slider
                        min={0}
                        max={100}
                        step={5}
                        value={[editState.discountPercent]}
                        onValueChange={([v]) =>
                          setEditState({ ...editState, discountPercent: v })
                        }
                      />
                    </div>
                  </>
                )}
                <div className="space-y-1.5">
                  <Label>Location</Label>
                  <Input
                    value={editState.location}
                    onChange={(e) =>
                      setEditState({ ...editState, location: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setEditState(null);
                  }}
                  data-ocid="sender.edit.cancel_button"
                >
                  Cancel
                </Button>
                <Button onClick={saveEdit} data-ocid="sender.edit.save_button">
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          className="text-primary hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
