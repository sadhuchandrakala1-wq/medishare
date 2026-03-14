import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface OrderRecord {
    id: string;
    finalPrice: bigint;
    customerName: string;
    status: string;
    paymentStatus: PaymentStatus;
    originalCost: bigint;
    discountAmount: bigint;
    createdAt: Time;
    paymentMode: PaymentMode;
    customerId: Principal;
    discountPercentage: bigint;
    medicineId: string;
    senderId: Principal;
    medicineName: string;
}
export interface Medicine {
    id: string;
    finalPrice: bigint;
    cost: bigint;
    name: string;
    createdAt: Time;
    description: string;
    isFree: boolean;
    availability: MedicineAvailability;
    imageUrl: string;
    senderName: string;
    discount: bigint;
    paymentMode: PaymentMode;
    locationAddress: string;
    senderId: Principal;
}
export interface UserProfile {
    id: Principal;
    name: string;
    createdAt: Time;
    role: UserRole;
    email: string;
    address: string;
    phone: string;
}
export enum MedicineAvailability {
    outOfStock = "outOfStock",
    available = "available"
}
export enum PaymentMode {
    both = "both",
    offline = "offline",
    online = "online"
}
export enum PaymentStatus {
    pending = "pending",
    paid = "paid"
}
export enum UserRole {
    customer = "customer",
    sender = "sender"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    /**
     * / Create a new user profile for the caller. Requires authentication.
     */
    createUser(name: string, email: string, role: UserRole, phone: string, address: string): Promise<UserProfile>;
    /**
     * / Delete a medicine listing. Caller must own the listing.
     */
    deleteMedicine(medicineId: string): Promise<void>;
    /**
     * / List all medicines (unfiltered). Admin only.
     */
    getAllMedicines(): Promise<Array<Medicine>>;
    /**
     * / List all medicines sorted by cost. Public – no authentication required.
     */
    getAllMedicinesByCost(): Promise<Array<Medicine>>;
    /**
     * / List all medicines sorted by name. Public – no authentication required.
     */
    getAllMedicinesByName(): Promise<Array<Medicine>>;
    /**
     * / List all orders (unfiltered). Admin only.
     */
    getAllOrders(): Promise<Array<OrderRecord>>;
    /**
     * / List all registered users. Admin only.
     */
    getAllUsers(): Promise<Array<UserProfile>>;
    /**
     * / Return the access-control role of the caller. Public – no authentication required.
     */
    getCallerAccessRole(): Promise<UserRole__1>;
    /**
     * / Get the calling user's own profile.
     */
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    /**
     * / Get the current authenticated user's profile (non-optional, traps if missing).
     */
    getCurrentUser(): Promise<UserProfile>;
    /**
     * / List all orders placed by the calling customer.
     */
    getCustomerOrders(): Promise<Array<OrderRecord>>;
    /**
     * / Get a medicine by ID. Public – no authentication required.
     */
    getMedicineById(medicineId: string): Promise<Medicine>;
    /**
     * / Get an order by ID. Only the customer or sender involved, or an admin, may view it.
     */
    getOrderById(orderId: string): Promise<OrderRecord>;
    /**
     * / List all medicines uploaded by the calling sender. Requires authentication.
     */
    getSenderMedicines(): Promise<Array<Medicine>>;
    /**
     * / List all orders received by the calling sender.
     */
    getSenderOrders(): Promise<Array<OrderRecord>>;
    /**
     * / Fetch any user by principal. Only the user themselves or an admin may call this.
     */
    getUserById(userId: Principal): Promise<UserProfile>;
    /**
     * / List users filtered by application role. Admin only.
     */
    getUserByRole(role: UserRole): Promise<Array<UserProfile>>;
    /**
     * / Fetch another user's profile. Callers may only view their own profile
     * / unless they are an admin.
     */
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    /**
     * / Place an order for a medicine. Caller must be an authenticated user (customer).
     */
    placeOrder(medicineId: string, customerName: string, paymentMode: PaymentMode): Promise<OrderRecord>;
    /**
     * / Save / update the calling user's own profile.
     */
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    /**
     * / Update a medicine listing. Caller must own the listing.
     */
    updateMedicine(medicineId: string, name: string, description: string, cost: bigint, discount: bigint, availability: MedicineAvailability, paymentMode: PaymentMode, imageUrl: string, locationAddress: string): Promise<Medicine>;
    /**
     * / Update an order's status. Only the sender of the order or an admin may do this.
     */
    updateOrderStatus(orderId: string, status: string, paymentStatus: PaymentStatus): Promise<OrderRecord>;
    /**
     * / Update the calling user's own profile fields.
     */
    updateUserProfile(name: string, email: string, phone: string, address: string): Promise<UserProfile>;
    /**
     * / Upload a new medicine listing. Caller must be an authenticated user (sender).
     */
    uploadMedicine(senderName: string, medicineName: string, description: string, cost: bigint, discount: bigint, availability: MedicineAvailability, paymentMode: PaymentMode, imageUrl: string, locationAddress: string): Promise<Medicine>;
}
