import { useNavigate } from "@tanstack/react-router";
import {
  ChevronRight,
  Heart,
  MapPin,
  Package,
  Shield,
  Star,
} from "lucide-react";
import { motion } from "motion/react";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="gradient-hero relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <img
                src="/assets/generated/medishare-logo-transparent.dim_200x200.png"
                alt="MEDISHARE"
                className="w-14 h-14 rounded-2xl"
              />
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
                MEDI<span className="text-white/70">SHARE</span>
              </h1>
            </div>
            <p className="text-white/80 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
              Share unused medicines, reduce waste, and help those in need —
              right in your neighborhood.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center gap-8 mt-8"
          >
            {[
              { value: "2,400+", label: "Medicines Shared" },
              { value: "850+", label: "Active Donors" },
              { value: "12 Cities", label: "Across India" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-display font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-white/60 text-xs">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Role Selection */}
      <div className="max-w-3xl mx-auto px-6 -mt-6 relative z-20">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-6"
        >
          Choose your role to get started
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Customer Card */}
          <motion.button
            data-ocid="home.customer_button"
            onClick={() =>
              navigate({ to: "/register/$role", params: { role: "customer" } })
            }
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group bg-card rounded-2xl p-6 text-left border-2 border-border hover:border-primary/60 shadow-card transition-all duration-300 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-display font-bold text-foreground">
                  I'm a Customer
                </h3>
                <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                  Search and book medicines nearby. View discounts, free
                  offerings, and pay online.
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {["Search Nearby", "Book Medicines", "Track Orders"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
          </motion.button>

          {/* Sender Card */}
          <motion.button
            data-ocid="home.sender_button"
            onClick={() =>
              navigate({ to: "/register/$role", params: { role: "sender" } })
            }
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group bg-card rounded-2xl p-6 text-left border-2 border-border hover:border-accent/60 shadow-card transition-all duration-300 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
              <Package className="w-6 h-6 text-accent" />
            </div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-display font-bold text-foreground">
                  I'm a Sender
                </h3>
                <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                  List your unused medicines for sale, with discounts, or
                  completely free.
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-accent transition-colors flex-shrink-0 mt-1" />
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {["List Medicines", "Set Discounts", "Manage Requests"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>
          </motion.button>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-4xl mx-auto px-6 py-14">
        <h2 className="text-center text-2xl font-display font-bold mb-8">
          Why MEDISHARE?
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              icon: MapPin,
              title: "Location-Based",
              desc: "Find medicines available near you using GPS-powered search.",
            },
            {
              icon: Star,
              title: "Discounts & Free",
              desc: "Save money with discounts or get medicines completely free from donors.",
            },
            {
              icon: Shield,
              title: "Safe & Trusted",
              desc: "Every listing is verified with seller profiles and transparent pricing.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-center p-5"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold mb-1.5">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()}. Built with{" "}
        <Heart className="inline w-3 h-3 text-destructive mx-0.5" /> using{" "}
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
