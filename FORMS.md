# Forms & Field Guide (with examples)

This document covers the major forms in **Your-Homes-Dubai**. For each form field we provide:
- **Field**: what the field is for
- **What to enter**: expected input/format
- **Example**: sample value

> Note: Some forms are on the public website, and others are in the **Admin panel**.

---

## Public Website Forms

### 1) Contact / Lead Form (Request Private Consultation)
- **File**: `src/components/ui/LeadCaptureForm.jsx`
- **Used on**: `src/pages/ContactPage.jsx` and other site sections

**Fields**
- **Full Name** *(required)*  
  - **Why we ask**: Helps identify the client and keeps lead records consistent.  
  - **What to enter**: the user's full name  
  - **Example**: `Ahmed Khan`

- **Email** *(required)*  
  - **Why we ask**: Used for follow-up and sending property options/documents.  
  - **What to enter**: a valid email address  
  - **Example**: `ahmed.khan@gmail.com`

- **Phone** *(optional)*  
  - **Why we ask**: Enables faster contact (calls/WhatsApp) and improves lead quality.  
  - **What to enter**: phone number (international format preferred)  
  - **Example**: `+971 50 123 4567`

- **Budget** *(optional)*  
  - **Why we ask**: Allows better property matching and avoids irrelevant suggestions.  
  - **What to select**: one of the dropdown options (Under 2M, 2M–5M, etc.)  
  - **Example**: `2m-5m`

- **Preferred Area** *(optional — full variant only)*  
  - **Why we ask**: Area preference is a key search filter and supports advisor routing by community.  
  - **What to select**: an area from the dropdown (loaded from the database)  
  - **Example**: `dubai-marina` (the area slug is stored)

- **Property Type** *(optional — full variant only)*  
  - **Why we ask**: Helps narrow inventory and improves recommendation accuracy.  
  - **What to select**: Apartment / Villa / Penthouse / Townhouse  
  - **Example**: `villa`

- **Message** *(optional)*  
  - **Why we ask**: Captures additional requirements (timeline, view, payment plan, etc.).  
  - **What to enter**: requirements / notes  
  - **Example**: `I want a 3BR villa in Dubai Hills, budget 5M, ready property.`

**Submit behavior**
- On submit, the button shows **Sending…**.
- On success, a **“Message sent successfully…”** confirmation appears under the form.

---

### 2) Chat Widget (Message Input)
- **File**: `src/components/ui/ChatWidget.jsx`

**Fields**
- **Message** *(single-line input)*  
  - **Why we ask**: This is the user’s request; it drives the assistant’s response and property suggestions.  
  - **What to enter**: the user's question / requirement  
  - **Example**: `I’m looking for a 2BR apartment in Downtown under 2.5M`

---

## Admin Panel Forms

### 3) Admin Login
- **File**: `src/admin/AdminLogin.jsx`

**Fields**
- **Email** *(required)*  
  - **Why we ask**: Identifies the admin account for authentication.  
  - **What to enter**: the admin email address.  
  - **Example**: `admin@yourhomes.ae`
- **Password** *(required)*  
  - **Why we ask**: Confirms identity and protects access to the admin dashboard.  
  - **What to enter**: the admin password.  
  - **Example**: `your-secure-password`

---

### 4) Site Settings (Global Contact + Social + Outbound Email)
- **File**: `src/admin/Settings.jsx`

**Contact Information**
- **Office Address** *(required)*  
  - **Why we ask**: Shown publicly (contact page/footer) as the official business address.  
  - **What to enter**: the full office address (multi-line allowed).  
  - **Example**: `A-202, Prime Business Center, Dubai, UAE`
- **Contact Phone** *(required)*  
  - **Why we ask**: Shown publicly and used for click-to-call links.  
  - **What to enter**: the main business phone number.  
  - **Example**: `+971 4 454 1313`
- **Contact Email** *(required)*  
  - **Why we ask**: Shown publicly and used for mailto links.  
  - **What to enter**: the public contact email address.  
  - **Example**: `info@yourhomes.ae`
- **WhatsApp Number** *(optional, used for links)*  
  - **Why we ask**: Enables one-click WhatsApp inquiries from the website.  
  - **What to enter**: WhatsApp number in international format, digits only recommended (no `+`, no spaces).  
  - **Example**: `97144541313` (digits only recommended)

**Outbound email (leads & chatbot)**
- **SMTP sign-in email** *(optional)*  
  - **Why we ask**: Used to send outbound notifications (contact form + chatbot lead emails).  
  - **What to enter**: a Gmail/Google Workspace address to send emails from.  
  - **Example**: `notifications@yourhomes.ae`
- **App password** *(optional)*  
  - **Why we ask**: Required by Gmail SMTP when using app passwords (more secure than account password).  
  - **What to enter**: the Gmail/Workspace app password for the SMTP account.  
  - **Example**: `xxxx xxxx xxxx xxxx` (Gmail/Workspace app password)
- **Manager email (hot leads & fallbacks)** *(optional)*  
  - **Why we ask**: Hot leads are urgent; this ensures a manager is notified immediately (also used as fallback routing).  
  - **What to enter**: the manager’s email address.  
  - **Example**: `manager@yourhomes.ae`

**Social Presence**
- **Instagram URL** *(optional)*  
  - **Why we ask**: Used for the Instagram icon/link in the footer and other social sections.  
  - **What to enter**: the full Instagram profile URL.  
  - **Example**: `https://www.instagram.com/yourhomesdubai/`
- **Facebook URL** *(optional)*  
  - **Why we ask**: Used for the Facebook icon/link in the footer and other social sections.  
  - **What to enter**: the full Facebook page URL.  
  - **Example**: `https://www.facebook.com/yourhomesdubai/`
- **LinkedIn URL** *(optional)*  
  - **Why we ask**: Used for the LinkedIn icon/link in the footer and other social sections.  
  - **What to enter**: the full LinkedIn company page URL.  
  - **Example**: `https://www.linkedin.com/company/yourhomesdubai/`

---

### 5) Team Member (About Page + Chatbot Routing)
- **File**: `src/admin/TeamForm.jsx`

**Profile**
- **Name** *(required)*  
  - **Why we ask**: Displayed on the About page and used internally for assignment/communication.  
  - **What to enter**: the advisor’s full name.  
  - **Example**: `Sarah Ali`
- **Role / Title** *(required)*  
  - **Why we ask**: Displayed publicly and helps route leads to the right specialist.  
  - **What to enter**: the advisor’s role/title.  
  - **Example**: `Senior Property Advisor`
- **Area (optional)** *(dropdown; stores the area slug)*  
  - **Why we ask**: Enables area-based routing for “talk to an agent” requests.  
  - **What to select**: the advisor’s primary community/area.  
  - **Example**: `palm-jumeirah`
- **Bio** *(optional)*  
  - **Why we ask**: Builds trust by summarizing experience and specialization.  
  - **What to enter**: a short professional bio.  
  - **Example**: `Specialist in luxury waterfront properties with 8+ years in Dubai.`
- **Mobile** *(optional)*  
  - **Why we ask**: Optional public contact number and internal reference.  
  - **What to enter**: phone number in international format.  
  - **Example**: `+971 50 987 6543`
- **Public email** *(optional)*  
  - **Why we ask**: Optional public email shown on About (only if you want direct contact).  
  - **What to enter**: an email safe to publish.  
  - **Example**: `sarah@yourhomes.ae`

**Photo**
- **Image URL** *(optional)*  
  - **Why we ask**: Shows the advisor photo on About; improves credibility.  
  - **What to enter**: a direct image URL (https).  
  - **Example**: `https://cdn.yourhomes.ae/team/sarah.jpg`
- **Upload Image** *(optional)*  
  - **Why we ask**: Allows uploading without managing external hosting.  
  - **What to select**: a local image file (jpg/png/webp)

**Chatbot routing**
- **Routing key** *(optional)*  
  - **Why we ask**: Routes “specific advisor” requests (founder/investment desk) to the correct person.  
  - **What to enter**: a short unique key (lowercase recommended).  
  - **Example**: `investment`
- **Notify email** *(recommended)*  
  - **Why we ask**: This is where chatbot lead alerts and notifications will be sent.  
  - **What to enter**: the advisor/team notification email address.  
  - **Example**: `sarah.alerts@yourhomes.ae`
- **Keywords** *(optional)*  
  - **Why we ask**: Helps match user wording to the correct routing key.  
  - **What to enter**: comma-separated keywords/phrases.  
  - **Example**: `investment advisory, portfolio, ROI`

**Publishing**
- **Sort order** *(optional number)*  
  - **Why we ask**: Controls ordering of team members on About and admin lists.  
  - **What to enter**: a number (lower appears first).  
  - **Example**: `10`
- **Active** *(checkbox)*  
  - **Why we ask**: Lets you hide inactive members without deleting their record.  
  - **What to enter**: check to show; uncheck to hide.  
  - **Example**: `checked` (member will appear on the About page)

---

### 6) Property (Add / Edit Listing)
- **File**: `src/admin/PropertyForm.jsx`

**Basic Information**
- **Title** *(required)*  
  - **Why we ask**: Public-facing listing title used in search and marketing.  
  - **What to enter**: a clear title (type + key location).  
  - **Example**: `Luxury Penthouse — Palm Jumeirah`
- **Type** *(required)*  
  - **Why we ask**: Core categorization for filtering and client expectations.  
  - **What to select**: a property type from the dropdown.  
  - **Example**: `Penthouse`
- **Status** *(required)*  
  - **Why we ask**: Indicates if it’s ready/off-plan/rental and affects how clients interpret pricing and timelines.  
  - **What to select**: a status value.  
  - **Example**: `Ready` (or `Off-Plan`, `Resale`, `Rental`)
- **Price (AED)** *(required)*  
  - **Why we ask**: Used for sorting/filtering and shown prominently on the listing.  
  - **What to enter**: numeric AED amount (no commas).  
  - **Example**: `5000000`
- **Purpose** *(required)*  
  - **Why we ask**: Distinguishes sale vs rent inventory.  
  - **What to select**: `For Sale` or `For Rent`.  
  - **Example**: `For Sale` / `For Rent`
- **Usage** *(required)*  
  - **Why we ask**: Distinguishes residential vs commercial listings.  
  - **What to select**: `Residential` or `Commercial`.  
  - **Example**: `Residential`
- **Rent Frequency** *(required only if Status = Rental)*  
  - **Why we ask**: Needed to interpret rental price correctly (monthly vs yearly).  
  - **What to select**: Daily / Weekly / Monthly / Yearly.  
  - **Example**: `Yearly`
- **Developer** *(optional)*  
  - **Why we ask**: Common buyer filter and improves listing context.  
  - **What to enter**: developer name (if known).  
  - **Example**: `Emaar`

**Specifications**
- **Bedrooms** *(required number)*  
  - **Why we ask**: Helps filter listings and match buyer needs (e.g., family size), and is a core spec on property portals.  
  - **What to enter**: Total number of bedrooms (numeric).  
  - **Example**: `3`

- **Bathrooms** *(required number)*  
  - **Why we ask**: Affects usability and value; frequently used in searches and comparisons.  
  - **What to enter**: Total number of bathrooms (numeric).  
  - **Example**: `4`

- **Area** *(required number)*  
  - **Why we ask**: The built size is essential for pricing, comparisons (price per sq ft), and buyer shortlisting.  
  - **What to enter**: Area value as a number (no commas).  
  - **Example**: `3200`

- **Area Unit** *(optional)*  
  - **Why we ask**: Dubai listings commonly use `sq ft`, but some sources use `sq m`. This keeps area understandable.  
  - **What to enter**: Unit text (usually `sq ft`).  
  - **Example**: `sq ft`

- **Reference Number** *(optional)*  
  - **Why we ask**: Internal / portal reference to track the listing (useful for CRM, Bayut/PropertyFinder sync, and client follow-ups).  
  - **What to enter**: Any reference code your team uses.  
  - **Example**: `BAYUT-1234`

- **Furnished Status** *(optional)*  
  - **Why we ask**: Furnishing affects rental demand, pricing, and buyer decision-making.  
  - **What to enter**: Select the furnishing state (e.g., Furnished / Unfurnished / Partly Furnished).  
  - **Example**: `Furnished`

- **Built-up Area** *(optional)*  
  - **Why we ask**: Some data sources provide an additional “built-up” size or a specific formatted size string; this field keeps that info when needed for portals or client clarity.  
  - **What to enter**: A readable value (e.g., `2,500 sqft`) or `NA` if not applicable.  
  - **Example**: `2,500 sqft`

- **Completion** *(optional)*  
  - **Why we ask**: Important for off-plan timelines and buyer planning; helps distinguish ready vs upcoming handover.  
  - **What to enter**: A date or period label.  
  - **Example**: `Q4 2026`

- **Service Chg** *(optional number)*  
  - **Why we ask**: Service charges impact ownership cost and investor ROI; clients often compare by AED/sqft.  
  - **What to enter**: Number only (AED per sq ft).  
  - **Example**: `18`

**Location**
- **Select Area** *(required — select an area name)*  
  - **Why we ask**: Primary community filter for browsing and search.  
  - **What to select**: an area name from the dropdown.  
  - **Example**: `Dubai Marina`
- **Location Slug** *(auto-set)*  
  - **Why we ask**: Stable internal identifier used for URLs and routing.  
  - **What to enter**: nothing (auto-filled).  
  - **Example**: `dubai-marina`
- **Specific Location / Address** *(required)*  
  - **Why we ask**: Adds tower/street details for higher-quality inquiries and easier scheduling.  
  - **What to enter**: tower/building + sub-location text.  
  - **Example**: `Marina Gate 2 / Sheikh Zayed Road`

**Description & Features**
- **Description** *(optional)*  
  - **Why we ask**: Helps communicate the full story and key selling points beyond structured fields.  
  - **What to enter**: a readable description (paragraphs allowed).  
  - **Example**: `Fully upgraded penthouse with sea view...`
- **Features (comma separated)** *(optional)*  
  - **Why we ask**: Captures unique selling points and can be shown as tags/bullets.  
  - **What to enter**: comma-separated list of features.  
  - **Example**: `Private Pool, Sea View, Smart Home`
- **Amenities (comma separated)** *(optional)*  
  - **Why we ask**: Amenities influence decisions and help comparisons.  
  - **What to enter**: comma-separated list of amenities.  
  - **Example**: `Gym, Pool, Concierge`

**Assigned Agent**
- **Select from team** *(optional)*  
  - **Why we ask**: Assigns the listing to a team member and auto-fills agent details.  
  - **What to select**: a team member from Admin → Team.  
  - **Example**: `Sarah Ali — Senior Property Advisor`
- **Agent Name** *(optional)*  
  - **Why we ask**: Shows who is responsible for the listing (client trust + internal accountability).  
  - **What to enter**: agent/advisor name.  
  - **Example**: `Sarah Ali`
- **Agent Phone** *(optional)*  
  - **Why we ask**: Enables direct contact via click-to-call.  
  - **What to enter**: agent phone number.  
  - **Example**: `+971 50 987 6543`
- **Agent Photo URL** *(optional)*  
  - **Why we ask**: Displays the agent photo on the listing.  
  - **What to enter**: a direct image URL (https).  
  - **Example**: `https://cdn.yourhomes.ae/team/sarah.jpg`

**Images**
- **Main Image** *(optional URL or upload)*  
  - **Why we ask**: Main thumbnail/hero image for the listing.  
  - **What to enter**: a direct image URL or upload an image.  
  - **Example**: `https://cdn.yourhomes.ae/properties/123/main.jpg`
- **Gallery URLs (one per line)** *(optional)*  
  - **Why we ask**: Adds multiple photos to improve buyer confidence and conversions.  
  - **What to enter**: one image URL per line (or upload multiple).  
  - **Example**:  
    - `https://cdn.yourhomes.ae/properties/123/1.jpg`  
    - `https://cdn.yourhomes.ae/properties/123/2.jpg`
- **Video Tour** *(optional URL or upload)*  
  - **Why we ask**: Video increases engagement and reduces low-quality inquiries.  
  - **What to enter**: a video URL or upload a video file.  
  - **Example**: `https://cdn.yourhomes.ae/properties/123/tour.mp4`
- **Floor Plan** *(optional)*  
  - **Why we ask**: Helps clients understand layout and room flow.  
  - **What to enter**: a floor plan image URL.  
  - **Example**: `https://cdn.yourhomes.ae/properties/123/floorplan.jpg`

**Additional Options**
- **Featured Property** *(checkbox)*  
  - **Why we ask**: Featured listings get higher visibility on the website.  
  - **What to enter**: check to feature; uncheck otherwise.  
  - **Example**: `checked`
- **Golden Visa Eligible** *(checkbox)*  
  - **Why we ask**: Helps market and filter properties that may qualify for Golden Visa.  
  - **What to enter**: check if eligible; uncheck otherwise.  
  - **Example**: `checked`

---

### 7) Area (Add / Edit Community)
- **File**: `src/admin/AreaForm.jsx`

**Identity**
- **Name** *(required)*  
  - **Why we ask**: Public area/community name displayed on the website.  
  - **What to enter**: the official area/community name.  
  - **Example**: `Palm Jumeirah`
- **Slug** *(required)*  
  - **Why we ask**: Used in URLs and internal lookups (stable identifier).  
  - **What to enter**: lowercase slug with hyphens.  
  - **Example**: `palm-jumeirah`
- **Tagline** *(required)*  
  - **Why we ask**: Short positioning line used on area cards and headers.  
  - **What to enter**: a short tagline.  
  - **Example**: `The Icon of Island Living`
- **Distance** *(optional text)*  
  - **Why we ask**: Useful context (distance to key landmarks) for clients comparing areas.  
  - **What to enter**: plain text (km/min) as needed.  
  - **Example**: `Distance from Dubai Mall: 18–22 km`

**Content**
- **Short Description (Grid Cards)** *(optional)*  
  - **Why we ask**: Used in compact UI (cards/grids) where space is limited.  
  - **What to enter**: 1–2 short sentences.  
  - **Example**: `Luxury waterfront community with private beaches.`
- **Description (Detail Page)** *(optional)*  
  - **Why we ask**: Main descriptive content on the area detail page.  
  - **What to enter**: longer paragraph(s) describing the area.  
  - **Example**: `Palm Jumeirah offers premium apartments and villas...`
- **Lifestyle Details** *(optional)*  
  - **Why we ask**: Explains day-to-day living and local highlights for families and end-users.  
  - **What to enter**: short notes or bullet-style text.  
  - **Example**: `Beach clubs, fine dining, marinas, 5-star resorts.`
- **Investment Appeal** *(optional)*  
  - **Why we ask**: Investor-focused explanation (demand, yield, resale liquidity).  
  - **What to enter**: short investment notes.  
  - **Example**: `Strong demand for short-term rentals; high resale liquidity.`

**Market Stats**
- **Avg Price** *(optional)*  
  - **Why we ask**: Provides an area benchmark (often used for price-per-sqft comparisons).  
  - **What to enter**: formatted value (e.g., `AED 3,200/sq ft`).  
  - **Example**: `AED 3,200/sq ft`
- **Rental Yield** *(optional)*  
  - **Why we ask**: Key ROI metric for investors.  
  - **What to enter**: percentage value.  
  - **Example**: `5.2%`
- **Price Growth** *(optional)*  
  - **Why we ask**: Shows market momentum and historical performance.  
  - **What to enter**: formatted growth value (e.g., `+18% YoY`).  
  - **Example**: `+18% YoY`
- **Total Units** *(optional)*  
  - **Why we ask**: Indicates size/supply of the community; useful context for investors.  
  - **What to enter**: approximate unit count.  
  - **Example**: `4,000+`

**Visuals**
- **Preview Image (800w)** *(optional URL or upload)*  
  - **Why we ask**: Used as the area thumbnail/card image.  
  - **What to enter**: a direct image URL or upload.  
  - **Example**: `https://cdn.yourhomes.ae/areas/palm/card.jpg`
- **Hero Background (1920w)** *(optional URL or upload)*  
  - **Why we ask**: Large header image for the area detail page.  
  - **What to enter**: a high-resolution image URL or upload.  
  - **Example**: `https://cdn.yourhomes.ae/areas/palm/hero.jpg`
- **Location Images (Featured Section)** *(optional multiple upload)*  
  - **Why we ask**: Supports featured galleries/sections to visually represent the area.  
  - **What to enter**: multiple images (upload) or multiple URLs depending on workflow.  
  - **Example**: multiple images like `https://cdn.yourhomes.ae/areas/palm/loc-1.jpg`, `https://cdn.yourhomes.ae/areas/palm/loc-2.jpg`

