# MEDISHARE

## Current State
New project — no existing code.

## Requested Changes (Diff)

### Add
- Home page with role selection: Customer or Sender (register/login)
- Customer Dashboard:
  - Search bar for medicines by name/location
  - Nearby medicine listings with distance indicator
  - Discount availability badge on listings
  - Book/Reserve button per listing
  - Profile page (name, location, order history)
  - Payment option (pay or free)
- Sender Dashboard:
  - Add medicine form: name, quantity, price, discount %, location, free toggle
  - View incoming booking requests with accept/decline
  - Manage listings (edit/delete)
  - Request count per listing
- Backend:
  - User profiles with role (customer | sender)
  - Medicine listings: id, senderId, name, quantity, price, discount, isFree, location, lat, lng
  - Bookings: id, customerId, listingId, status (pending/accepted/declined)
  - Search/filter listings by name and location

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Select authorization + stripe components
2. Generate Motoko backend with users, listings, bookings actors
3. Build React frontend:
   - Landing/home page with Customer / Sender role cards
   - Auth flow (login/register with role)
   - Customer dashboard: search, nearby list, book, payment
   - Sender dashboard: add listing, discount, free toggle, manage requests
   - Profile page
4. Deploy
