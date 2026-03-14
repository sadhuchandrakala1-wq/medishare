import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "customer" | "sender";
  location: string;
};

export type Listing = {
  id: string;
  senderId: string;
  senderName: string;
  medicineName: string;
  quantity: number;
  price: number;
  discountPercent: number;
  isFree: boolean;
  location: string;
  active: boolean;
  requestCount: number;
};

export type Booking = {
  id: string;
  listingId: string;
  customerId: string;
  customerName: string;
  medicineName: string;
  quantityRequested: number;
  status: "pending" | "accepted" | "declined" | "completed";
  paymentMethod: "free" | "online";
  totalPrice: number;
};

const SEED_LISTINGS: Listing[] = [
  {
    id: "lst-1",
    senderId: "seed-sender-1",
    senderName: "Priya Sharma",
    medicineName: "Paracetamol 500mg",
    quantity: 30,
    price: 0,
    discountPercent: 0,
    isFree: true,
    location: "Koramangala, Bangalore",
    active: true,
    requestCount: 4,
  },
  {
    id: "lst-2",
    senderId: "seed-sender-2",
    senderName: "Rajesh Kumar",
    medicineName: "Metformin 500mg",
    quantity: 60,
    price: 120,
    discountPercent: 25,
    isFree: false,
    location: "Indiranagar, Bangalore",
    active: true,
    requestCount: 7,
  },
  {
    id: "lst-3",
    senderId: "seed-sender-3",
    senderName: "Ananya Iyer",
    medicineName: "Cetirizine 10mg",
    quantity: 20,
    price: 85,
    discountPercent: 0,
    isFree: false,
    location: "Whitefield, Bangalore",
    active: true,
    requestCount: 2,
  },
  {
    id: "lst-4",
    senderId: "seed-sender-4",
    senderName: "Vikram Nair",
    medicineName: "Amoxicillin 250mg",
    quantity: 15,
    price: 200,
    discountPercent: 40,
    isFree: false,
    location: "HSR Layout, Bangalore",
    active: true,
    requestCount: 5,
  },
  {
    id: "lst-5",
    senderId: "seed-sender-5",
    senderName: "Meena Pillai",
    medicineName: "Vitamin D3 1000IU",
    quantity: 90,
    price: 0,
    discountPercent: 0,
    isFree: true,
    location: "JP Nagar, Bangalore",
    active: true,
    requestCount: 11,
  },
];

const MOCK_DISTANCES = [
  "0.8 km",
  "1.2 km",
  "2.1 km",
  "3.4 km",
  "4.0 km",
  "0.5 km",
  "1.8 km",
];

export function getMockDistance(id: string): string {
  const idx = id.charCodeAt(id.length - 1) % MOCK_DISTANCES.length;
  return MOCK_DISTANCES[idx];
}

type AppContextType = {
  currentUser: UserProfile | null;
  listings: Listing[];
  bookings: Booking[];
  register: (data: Omit<UserProfile, "id">) => {
    success: boolean;
    error?: string;
  };
  login: (
    email: string,
    password: string,
  ) => { success: boolean; error?: string };
  logout: () => void;
  addListing: (data: Omit<Listing, "id" | "requestCount">) => void;
  updateListing: (id: string, data: Partial<Listing>) => void;
  deleteListing: (id: string) => void;
  addBooking: (data: Omit<Booking, "id">) => void;
  updateBookingStatus: (id: string, status: Booking["status"]) => void;
  incrementRequestCount: (listingId: string) => void;
};

const AppContext = createContext<AppContextType | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // ignore
  }
  return fallback;
}

function saveToStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() =>
    loadFromStorage("medi_currentUser", null),
  );
  const [users, setUsers] = useState<UserProfile[]>(() =>
    loadFromStorage("medi_users", []),
  );
  const [listings, setListings] = useState<Listing[]>(() => {
    const stored = loadFromStorage<Listing[] | null>("medi_listings", null);
    if (!stored) {
      saveToStorage("medi_listings", SEED_LISTINGS);
      return SEED_LISTINGS;
    }
    return stored;
  });
  const [bookings, setBookings] = useState<Booking[]>(() =>
    loadFromStorage("medi_bookings", []),
  );

  useEffect(() => {
    saveToStorage("medi_currentUser", currentUser);
  }, [currentUser]);
  useEffect(() => {
    saveToStorage("medi_users", users);
  }, [users]);
  useEffect(() => {
    saveToStorage("medi_listings", listings);
  }, [listings]);
  useEffect(() => {
    saveToStorage("medi_bookings", bookings);
  }, [bookings]);

  const register = (data: Omit<UserProfile, "id">) => {
    const existing = users.find((u) => u.email === data.email);
    if (existing) return { success: false, error: "Email already registered" };
    const user: UserProfile = { ...data, id: `user-${Date.now()}` };
    const newUsers = [...users, user];
    setUsers(newUsers);
    setCurrentUser(user);
    return { success: true };
  };

  const login = (email: string, password: string) => {
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );
    if (!user) return { success: false, error: "Invalid email or password" };
    setCurrentUser(user);
    return { success: true };
  };

  const logout = () => setCurrentUser(null);

  const addListing = (data: Omit<Listing, "id" | "requestCount">) => {
    const listing: Listing = {
      ...data,
      id: `lst-${Date.now()}`,
      requestCount: 0,
    };
    setListings((prev) => [...prev, listing]);
  };

  const updateListing = (id: string, data: Partial<Listing>) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...data } : l)),
    );
  };

  const deleteListing = (id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  const addBooking = (data: Omit<Booking, "id">) => {
    const booking: Booking = { ...data, id: `bkng-${Date.now()}` };
    setBookings((prev) => [...prev, booking]);
  };

  const updateBookingStatus = (id: string, status: Booking["status"]) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b)),
    );
  };

  const incrementRequestCount = (listingId: string) => {
    setListings((prev) =>
      prev.map((l) =>
        l.id === listingId ? { ...l, requestCount: l.requestCount + 1 } : l,
      ),
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        listings,
        bookings,
        register,
        login,
        logout,
        addListing,
        updateListing,
        deleteListing,
        addBooking,
        updateBookingStatus,
        incrementRequestCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
