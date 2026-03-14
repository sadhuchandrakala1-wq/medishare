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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import {
  CreditCard,
  LogOut,
  MapPin,
  Package,
  Search,
  ShoppingBag,
  Tag,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type Listing,
  getMockDistance,
  useApp,
} from "../../context/AppContext";

function discountedPrice(price: number, discount: number) {
  return price - (price * discount) / 100;
}

function MedicineCard({
  listing,
  index,
  onBook,
}: {
  listing: Listing;
  index: number;
  onBook: (l: Listing) => void;
}) {
  const distance = getMockDistance(listing.id);
  const finalPrice = discountedPrice(listing.price, listing.discountPercent);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="medicine-card p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-display font-semibold text-foreground truncate">
              {listing.medicineName}
            </h3>
            {listing.isFree && <span className="free-badge">FREE</span>}
            {!listing.isFree && listing.discountPercent > 0 && (
              <span className="discount-badge">
                {listing.discountPercent}% OFF
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground mb-2">
            {listing.senderName}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {distance}
            </span>
            <span className="flex items-center gap-1">
              <Package className="w-3 h-3" />
              Qty: {listing.quantity}
            </span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          {listing.isFree ? (
            <div className="text-success font-bold text-lg">FREE</div>
          ) : (
            <div>
              {listing.discountPercent > 0 && (
                <div className="text-muted-foreground line-through text-xs">
                  ₹{listing.price}
                </div>
              )}
              <div className="text-foreground font-bold text-lg">
                ₹{finalPrice.toFixed(0)}
              </div>
            </div>
          )}
          <Button
            size="sm"
            className="mt-2 text-xs h-7 px-3"
            data-ocid={`customer.book_button.${index + 1}`}
            onClick={() => onBook(listing)}
          >
            Book Now
          </Button>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-border text-xs text-muted-foreground flex items-center gap-1">
        <MapPin className="w-3 h-3" /> {listing.location}
      </div>
    </motion.div>
  );
}

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const {
    listings,
    bookings,
    currentUser,
    addBooking,
    incrementRequestCount,
    logout,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("browse");
  const [bookingListing, setBookingListing] = useState<Listing | null>(null);
  const [bookingQty, setBookingQty] = useState("1");
  const [paymentMethod, setPaymentMethod] = useState<"online" | "free">(
    "online",
  );

  const activeListings = listings.filter((l) => l.active);
  const filtered = searchQuery
    ? activeListings.filter((l) =>
        l.medicineName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : activeListings;

  const myBookings = currentUser
    ? bookings.filter((b) => b.customerId === currentUser.id)
    : [];

  function openBooking(listing: Listing) {
    setBookingListing(listing);
    setBookingQty("1");
    setPaymentMethod(listing.isFree ? "free" : "online");
  }

  function confirmBooking() {
    if (!currentUser || !bookingListing) return;
    const qty = Math.max(1, Number.parseInt(bookingQty) || 1);
    const finalPrice = bookingListing.isFree
      ? 0
      : discountedPrice(bookingListing.price, bookingListing.discountPercent) *
        qty;

    addBooking({
      listingId: bookingListing.id,
      customerId: currentUser.id,
      customerName: currentUser.name,
      medicineName: bookingListing.medicineName,
      quantityRequested: qty,
      status: "pending",
      paymentMethod,
      totalPrice: finalPrice,
    });
    incrementRequestCount(bookingListing.id);
    toast.success(`Booking request sent for ${bookingListing.medicineName}!`);
    setBookingListing(null);
  }

  function handleLogout() {
    logout();
    navigate({ to: "/" });
  }

  const statusColors: Record<string, string> = {
    pending: "bg-warning/20 text-warning-foreground border-warning/30",
    accepted: "bg-success/20 text-success border-success/30",
    declined: "bg-destructive/20 text-destructive border-destructive/30",
    completed: "bg-primary/20 text-primary border-primary/30",
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <header className="bg-card border-b border-border sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2 flex-shrink-0">
            <img
              src="/assets/generated/medishare-logo-transparent.dim_200x200.png"
              alt="MEDISHARE"
              className="w-7 h-7 rounded-lg"
            />
            <span className="font-display font-bold text-primary text-sm hidden sm:block">
              MEDISHARE
            </span>
          </div>

          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-ocid="customer.search_input"
              className="pl-9 h-9 text-sm"
              placeholder="Search medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              title={currentUser?.location || "Location"}
            >
              <MapPin className="w-4 h-4" />
            </button>

            <button
              type="button"
              data-ocid="customer.profile_link"
              onClick={() => navigate({ to: "/customer/profile" })}
              className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            >
              <User className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleLogout}
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
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-xl">
                Hi, {currentUser.name.split(" ")[0]}! 👋
              </h2>
              <p className="text-muted-foreground text-sm flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" /> {currentUser.location}
              </p>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-5">
            <TabsTrigger
              data-ocid="customer.browse.tab"
              value="browse"
              className="flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" /> Nearby Medicines
            </TabsTrigger>
            <TabsTrigger
              data-ocid="customer.bookings.tab"
              value="bookings"
              className="flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> My Bookings
              {myBookings.length > 0 && (
                <span className="ml-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {myBookings.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            {searchQuery && (
              <p className="text-sm text-muted-foreground mb-4">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""} for
                &ldquo;{searchQuery}&rdquo;
              </p>
            )}
            {filtered.length === 0 ? (
              <div
                data-ocid="customer.empty_state"
                className="text-center py-16"
              >
                <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">
                  No medicines found nearby.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {filtered.map((listing, i) => (
                  <MedicineCard
                    key={listing.id}
                    listing={listing}
                    index={i}
                    onBook={openBooking}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bookings">
            {myBookings.length === 0 ? (
              <div
                data-ocid="bookings.empty_state"
                className="text-center py-16"
              >
                <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No bookings yet.</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => setActiveTab("browse")}
                >
                  Browse Medicines
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {myBookings.map((booking, i) => (
                  <motion.div
                    key={booking.id}
                    data-ocid={`bookings.item.${i + 1}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card rounded-xl border border-border p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold">
                          {booking.medicineName}
                        </div>
                        <div className="text-sm text-muted-foreground mt-0.5">
                          Qty: {booking.quantityRequested} ·{" "}
                          {booking.paymentMethod === "free" ? (
                            <span className="text-success font-medium">
                              Free
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 inline-flex">
                              <CreditCard className="w-3 h-3" /> ₹
                              {booking.totalPrice.toFixed(0)}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge
                        className={`capitalize text-xs border ${statusColors[booking.status] || ""}`}
                        variant="outline"
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingListing && (
          <Dialog open onOpenChange={() => setBookingListing(null)}>
            <DialogContent data-ocid="booking.dialog" className="max-w-sm">
              <DialogHeader>
                <DialogTitle className="font-display">
                  Book Medicine
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="bg-secondary rounded-lg p-3">
                  <div className="font-semibold">
                    {bookingListing.medicineName}
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5">
                    by {bookingListing.senderName}
                  </div>
                  {bookingListing.isFree ? (
                    <span className="free-badge mt-2 inline-flex">FREE</span>
                  ) : (
                    <div className="mt-1 text-sm">
                      Price: ₹
                      {discountedPrice(
                        bookingListing.price,
                        bookingListing.discountPercent,
                      ).toFixed(0)}{" "}
                      per unit
                      {bookingListing.discountPercent > 0 && (
                        <span className="ml-2 text-muted-foreground line-through text-xs">
                          ₹{bookingListing.price}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label>Quantity</Label>
                  <Input
                    data-ocid="booking.quantity_input"
                    type="number"
                    min="1"
                    max={bookingListing.quantity}
                    value={bookingQty}
                    onChange={(e) => setBookingQty(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label>Payment Method</Label>
                  <Select
                    value={paymentMethod}
                    onValueChange={(v) =>
                      setPaymentMethod(v as "online" | "free")
                    }
                    disabled={bookingListing.isFree}
                  >
                    <SelectTrigger data-ocid="booking.payment_select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {bookingListing.isFree && (
                        <SelectItem value="free">Free (No payment)</SelectItem>
                      )}
                      {!bookingListing.isFree && (
                        <SelectItem value="online">
                          Pay Online — ₹
                          {(
                            discountedPrice(
                              bookingListing.price,
                              bookingListing.discountPercent,
                            ) * (Number.parseInt(bookingQty) || 1)
                          ).toFixed(0)}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setBookingListing(null)}
                  data-ocid="booking.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmBooking}
                  data-ocid="booking.confirm_button"
                >
                  Confirm Booking
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Footer */}
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
