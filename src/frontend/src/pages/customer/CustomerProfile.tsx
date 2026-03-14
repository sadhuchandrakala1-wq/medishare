import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CreditCard,
  Mail,
  MapPin,
  ShoppingBag,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useApp } from "../../context/AppContext";

export default function CustomerProfile() {
  const navigate = useNavigate();
  const { currentUser, bookings, logout } = useApp();

  if (!currentUser) {
    navigate({ to: "/" });
    return null;
  }

  const myBookings = bookings.filter((b) => b.customerId === currentUser.id);

  const statusColors: Record<string, string> = {
    pending: "bg-warning/20 text-warning-foreground border-warning/30",
    accepted: "bg-success/20 text-success border-success/30",
    declined: "bg-destructive/20 text-destructive border-destructive/30",
    completed: "bg-primary/20 text-primary border-primary/30",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-hero px-4 py-8">
        <button
          type="button"
          onClick={() => navigate({ to: "/customer" })}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
            <User className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-white">
              {currentUser.name}
            </h1>
            <span className="text-white/70 text-sm capitalize">
              {currentUser.role}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Info */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-5 shadow-xs"
        >
          <h2 className="font-display font-semibold mb-4">Profile Details</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">{currentUser.name}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{currentUser.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">Location:</span>
              <span className="font-medium">{currentUser.location}</span>
            </div>
          </div>
        </motion.div>

        {/* Booking History */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border p-5 shadow-xs"
        >
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="font-display font-semibold">Booking History</h2>
            <span className="text-xs text-muted-foreground ml-auto">
              {myBookings.length} total
            </span>
          </div>

          {myBookings.length === 0 ? (
            <div data-ocid="profile.empty_state" className="text-center py-8">
              <ShoppingBag className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No bookings yet.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => navigate({ to: "/customer" })}
              >
                Browse Medicines
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {myBookings.map((booking, i) => (
                <div
                  key={booking.id}
                  data-ocid={`profile.bookings.item.${i + 1}`}
                  className="flex items-start justify-between p-3 rounded-lg bg-secondary/50"
                >
                  <div>
                    <div className="font-medium text-sm">
                      {booking.medicineName}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Qty: {booking.quantityRequested} ·{" "}
                      {booking.paymentMethod === "free" ? (
                        <span className="text-success">Free</span>
                      ) : (
                        <span className="flex items-center gap-0.5 inline-flex">
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
              ))}
            </div>
          )}
        </motion.div>

        <Button
          variant="destructive"
          className="w-full"
          onClick={() => {
            logout();
            navigate({ to: "/" });
          }}
        >
          Logout
        </Button>
      </div>

      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground mt-4">
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
