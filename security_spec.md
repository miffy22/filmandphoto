# Security Specification: Film & Photo (CineFlow Studio)

## 1. Executive Summary & Authorization Architecture
Film & Photo is a professional 4K cinema client delivery portal and fine art print store for filmmakers and photographers. Data protection is enforced at the database layer through Cloud Firestore Security Rules, ensuring multi-tenant isolation across independent studios and guest access controls.

## 2. Security Invariants (8 Pillars)
1. **Unauthenticated Read Isolation**: Unauthenticated visitors cannot list or search through projects, studios, or store orders.
2. **Private Gallery Protection**: Draft, unlisted, and private client galleries can only be accessed by the authenticating studio owner (`ownerId == request.auth.uid`).
3. **Guest Read-Only Scoping**: Unauthenticated or client guests can only fetch a single project document (`get`) if that project is explicitly published (`isPublished == true` or `status in ['published', 'delivered']`).
4. **No Cross-Studio Tampering**: Studio A cannot modify, overwrite, reassign, or delete Studio B's projects or studio settings.
5. **Ownership Immutability**: Once a project is created by a studio owner, the `ownerId` field cannot be modified to transfer ownership to another entity.
6. **Order Privacy**: Store orders contain sensitive customer PII and shipping details. They cannot be listed or read by arbitrary visitors. Orders can only be read by the project studio owner or purchasing client.
7. **Order Immutability & Financial Integrity**: Orders cannot be deleted (`allow delete: if false;`). Only the owning studio can update fulfillment or tracking info.
8. **Studio Profile Confidentiality**: Studio configuration, payment details, and custom domain settings are strictly readable and writable only by the authenticated studio owner (`request.auth.uid == studioId`).

## 3. Data Model & Schema Mappings
- `/studios/{studioId}`: Owned by `request.auth.uid == studioId`.
- `/projects/{projectId}`: Owned by `request.auth.uid == resource.data.ownerId`.
- `/orders/{orderId}`: Linked to `projectId`, `ownerId`, and `clientEmail`.
- `/test/{docId}`: Public ping probe for connection health.

## 4. Test Matrix & "Dirty Dozen" Threat Scenarios
1. **Payload 1 (Unauthenticated List Projects)**: Unauthenticated visitor attempts `collection('projects').getDocs()` -> **DENIED (403)**.
2. **Payload 2 (Unauthenticated List Studios)**: Unauthenticated visitor attempts `collection('studios').getDocs()` -> **DENIED (403)**.
3. **Payload 3 (Unauthenticated List Orders)**: Unauthenticated visitor attempts `collection('orders').getDocs()` -> **DENIED (403)**.
4. **Payload 4 (Unauthenticated Read Private Draft)**: Unauthenticated visitor attempts `doc('projects', 'draft_project_1').getDoc()` where `isPublished = false` -> **DENIED (403)**.
5. **Payload 5 (Unauthenticated Read Published Gallery)**: Guest opens shared client link `doc('projects', 'published_wedding_1').getDoc()` where `status = 'published'` -> **ALLOWED (200)**.
6. **Payload 6 (Guest Attempt Delete Project)**: Guest or unauthenticated visitor attempts `deleteDoc(doc('projects', 'published_wedding_1'))` -> **DENIED (403)**.
7. **Payload 7 (Guest Attempt Edit Project)**: Guest attempts `updateDoc(...)` to modify video URL or studio branding -> **DENIED (403)**.
8. **Payload 8 (Cross-Studio Edit Project)**: Studio B (`uid: studio_b`) attempts `updateDoc(doc('projects', 'studio_a_proj'))` -> **DENIED (403)**.
9. **Payload 9 (Cross-Studio Delete Project)**: Studio B attempts `deleteDoc(doc('projects', 'studio_a_proj'))` -> **DENIED (403)**.
10. **Payload 10 (Studio Owner Valid Operation)**: Studio A (`uid: studio_a`) creates, updates, and reads their own project -> **ALLOWED (200)**.
11. **Payload 11 (Arbitrary Order Read)**: Visitor attempts to read another customer's order `doc('orders', 'order_999')` -> **DENIED (403)**.
12. **Payload 12 (Order Deletion Attempt)**: Any user attempts `deleteDoc(doc('orders', 'order_999'))` -> **DENIED (403)**.
