import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  // Include blob storage and authorization mixins
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserRole = {
    #sender;
    #customer;
  };

  public type UserProfile = {
    id : Principal;
    name : Text;
    email : Text;
    role : UserRole;
    phone : Text;
    address : Text;
    createdAt : Time.Time;
  };

  // Alias for compatibility
  public type User = UserProfile;

  public type PaymentMode = {
    #online;
    #offline;
    #both;
  };

  public type MedicineAvailability = {
    #available;
    #outOfStock;
  };

  public type Medicine = {
    id : Text;
    senderId : Principal;
    senderName : Text;
    name : Text;
    description : Text;
    cost : Nat;
    discount : Nat;
    finalPrice : Nat;
    isFree : Bool;
    availability : MedicineAvailability;
    paymentMode : PaymentMode;
    imageUrl : Text;
    locationAddress : Text;
    createdAt : Time.Time;
  };

  public type PaymentStatus = {
    #paid;
    #pending;
  };

  public type OrderRecord = {
    id : Text;
    medicineId : Text;
    medicineName : Text;
    senderId : Principal;
    customerId : Principal;
    customerName : Text;
    originalCost : Nat;
    discountPercentage : Nat;
    discountAmount : Nat;
    finalPrice : Nat;
    paymentStatus : PaymentStatus;
    paymentMode : PaymentMode;
    status : Text;
    createdAt : Time.Time;
  };

  // Store state using Maps
  let users = Map.empty<Principal, UserProfile>();
  let medicines = Map.empty<Text, Medicine>();
  let orders = Map.empty<Text, OrderRecord>();

  func getPrincipalUser(caller : Principal) : UserProfile {
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?user) { user };
    };
  };

  func getPrincipalMedicine(medicineId : Text) : Medicine {
    switch (medicines.get(medicineId)) {
      case (null) { Runtime.trap("Medicine not found") };
      case (?medicine) { medicine };
    };
  };

  func getPrincipalOrder(orderId : Text) : OrderRecord {
    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) { order };
    };
  };

  func generateMedicineId() : Text {
    let timeHex = Time.now().toText();
    "MED-" # timeHex;
  };

  // ── Required profile functions (per instructions) ──────────────────────────

  /// Get the calling user's own profile.
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can get their profile");
    };
    users.get(caller);
  };

  /// Save / update the calling user's own profile.
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save their profile");
    };
    // Ensure the stored id always matches the caller
    let sanitized : UserProfile = { profile with id = caller };
    users.add(caller, sanitized);
  };

  /// Fetch another user's profile. Callers may only view their own profile
  /// unless they are an admin.
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    users.get(user);
  };

  // ── User CRUD operations ───────────────────────────────────────────────────

  /// Create a new user profile for the caller. Requires authentication.
  public shared ({ caller }) func createUser(name : Text, email : Text, role : UserRole, phone : Text, address : Text) : async UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create a profile");
    };
    if (users.containsKey(caller)) {
      Runtime.trap("User already exists");
    };
    let newUser : UserProfile = {
      id = caller;
      name;
      email;
      role;
      phone;
      address;
      createdAt = Time.now();
    };
    users.add(caller, newUser);
    newUser;
  };

  /// Get the current authenticated user's profile (non-optional, traps if missing).
  public query ({ caller }) func getCurrentUser() : async UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can get their profile");
    };
    getPrincipalUser(caller);
  };

  /// Fetch any user by principal. Only the user themselves or an admin may call this.
  public query ({ caller }) func getUserById(userId : Principal) : async UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view profiles");
    };
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    switch (users.get(userId)) {
      case (null) { Runtime.trap("User not found") };
      case (?user) { user };
    };
  };

  /// Update the calling user's own profile fields.
  public shared ({ caller }) func updateUserProfile(name : Text, email : Text, phone : Text, address : Text) : async UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update their profile");
    };
    let existingUser = getPrincipalUser(caller);
    let updatedUser : UserProfile = {
      existingUser with
      name;
      email;
      phone;
      address;
    };
    users.add(caller, updatedUser);
    updatedUser;
  };

  // ── Medicine CRUD operations ───────────────────────────────────────────────

  /// Upload a new medicine listing. Caller must be an authenticated user (sender).
  public shared ({ caller }) func uploadMedicine(senderName : Text, medicineName : Text, description : Text, cost : Nat, discount : Nat, availability : MedicineAvailability, paymentMode : PaymentMode, imageUrl : Text, locationAddress : Text) : async Medicine {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can upload medicines");
    };
    // Verify the caller has a registered profile
    ignore getPrincipalUser(caller);
    let medicineId = generateMedicineId();
    let finalPrice = if (discount > 0 and discount <= 100) {
      cost - (cost * discount / 100);
    } else {
      cost;
    };
    let newMedicine : Medicine = {
      id = medicineId;
      senderId = caller;
      senderName;
      name = medicineName;
      description;
      cost;
      discount;
      finalPrice;
      isFree = cost == 0;
      availability;
      paymentMode;
      imageUrl;
      locationAddress;
      createdAt = Time.now();
    };
    medicines.add(medicineId, newMedicine);
    newMedicine;
  };

  /// Get a medicine by ID. Public – no authentication required.
  public query func getMedicineById(medicineId : Text) : async Medicine {
    getPrincipalMedicine(medicineId);
  };

  /// List all medicines sorted by cost. Public – no authentication required.
  public query func getAllMedicinesByCost() : async [Medicine] {
    medicines.values().toArray().sort(func(m1 : Medicine, m2 : Medicine) : Order.Order {
      Nat.compare(m1.cost, m2.cost);
    });
  };

  /// List all medicines sorted by name. Public – no authentication required.
  public query func getAllMedicinesByName() : async [Medicine] {
    medicines.values().toArray().sort(func(m1 : Medicine, m2 : Medicine) : Order.Order {
      Text.compare(m1.name, m2.name);
    });
  };

  /// List all medicines uploaded by the calling sender. Requires authentication.
  public query ({ caller }) func getSenderMedicines() : async [Medicine] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their medicines");
    };
    medicines.values().toArray().filter(func(m : Medicine) : Bool {
      m.senderId == caller;
    });
  };

  /// Update a medicine listing. Caller must own the listing.
  public shared ({ caller }) func updateMedicine(medicineId : Text, name : Text, description : Text, cost : Nat, discount : Nat, availability : MedicineAvailability, paymentMode : PaymentMode, imageUrl : Text, locationAddress : Text) : async Medicine {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update medicines");
    };
    let existingMedicine = getPrincipalMedicine(medicineId);
    if (existingMedicine.senderId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: You can only update your own medicine listings");
    };
    let finalPrice = if (discount > 0 and discount <= 100) {
      cost - (cost * discount / 100);
    } else {
      cost;
    };
    let updatedMedicine : Medicine = {
      existingMedicine with
      name;
      description;
      cost;
      discount;
      finalPrice;
      isFree = cost == 0;
      availability;
      paymentMode;
      imageUrl;
      locationAddress;
    };
    medicines.add(medicineId, updatedMedicine);
    updatedMedicine;
  };

  /// Delete a medicine listing. Caller must own the listing.
  public shared ({ caller }) func deleteMedicine(medicineId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can delete medicines");
    };
    let existingMedicine = getPrincipalMedicine(medicineId);
    if (existingMedicine.senderId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: You can only delete your own medicine listings");
    };
    medicines.remove(medicineId);
  };

  // ── Order CRUD operations ──────────────────────────────────────────────────

  /// Place an order for a medicine. Caller must be an authenticated user (customer).
  public shared ({ caller }) func placeOrder(medicineId : Text, customerName : Text, paymentMode : PaymentMode) : async OrderRecord {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can place orders");
    };
    // Verify the caller has a registered profile
    ignore getPrincipalUser(caller);
    let medicine = getPrincipalMedicine(medicineId);
    let orderId = "ORD-" # Time.now().toText();
    let discountAmount = if (medicine.discount > 0 and medicine.discount <= 100) {
      medicine.cost * medicine.discount / 100;
    } else {
      0;
    };
    let newOrder : OrderRecord = {
      id = orderId;
      medicineId;
      medicineName = medicine.name;
      senderId = medicine.senderId;
      customerId = caller;
      customerName;
      originalCost = medicine.cost;
      discountPercentage = medicine.discount;
      discountAmount;
      finalPrice = medicine.finalPrice;
      paymentStatus = #pending;
      paymentMode;
      status = "Pending";
      createdAt = Time.now();
    };
    orders.add(orderId, newOrder);
    newOrder;
  };

  /// Get an order by ID. Only the customer or sender involved, or an admin, may view it.
  public query ({ caller }) func getOrderById(orderId : Text) : async OrderRecord {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view orders");
    };
    let order = getPrincipalOrder(orderId);
    if (order.customerId != caller and order.senderId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: You can only view your own orders");
    };
    order;
  };

  /// List all orders placed by the calling customer.
  public query ({ caller }) func getCustomerOrders() : async [OrderRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their orders");
    };
    orders.values().toArray().filter(func(o : OrderRecord) : Bool {
      o.customerId == caller;
    });
  };

  /// List all orders received by the calling sender.
  public query ({ caller }) func getSenderOrders() : async [OrderRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their orders");
    };
    orders.values().toArray().filter(func(o : OrderRecord) : Bool {
      o.senderId == caller;
    });
  };

  /// Update an order's status. Only the sender of the order or an admin may do this.
  public shared ({ caller }) func updateOrderStatus(orderId : Text, status : Text, paymentStatus : PaymentStatus) : async OrderRecord {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update order status");
    };
    let existingOrder = getPrincipalOrder(orderId);
    if (existingOrder.senderId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the sender or an admin can update order status");
    };
    let updatedOrder : OrderRecord = {
      existingOrder with
      status;
      paymentStatus;
    };
    orders.add(orderId, updatedOrder);
    updatedOrder;
  };

  // ── Admin-only operations ──────────────────────────────────────────────────

  /// List all registered users. Admin only.
  public query ({ caller }) func getAllUsers() : async [UserProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list all users");
    };
    users.values().toArray();
  };

  /// List all medicines (unfiltered). Admin only.
  public query ({ caller }) func getAllMedicines() : async [Medicine] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list all medicines");
    };
    medicines.values().toArray();
  };

  /// List all orders (unfiltered). Admin only.
  public query ({ caller }) func getAllOrders() : async [OrderRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can list all orders");
    };
    orders.values().toArray();
  };

  /// List users filtered by application role. Admin only.
  public query ({ caller }) func getUserByRole(role : UserRole) : async [UserProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can filter users by role");
    };
    users.values().toArray().filter(func(u : UserProfile) : Bool {
      u.role == role;
    });
  };

  // ── Utility ────────────────────────────────────────────────────────────────

  /// Return the access-control role of the caller. Public – no authentication required.
  public query ({ caller }) func getCallerAccessRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };
};
