# New Site Setup Checklist

Generic checklist for setting up a new venue website. Adapt as needed per client.

---

## 1. Planning

- [ ] Decide which pages/features the new site needs (menus, gallery, rooms, events, explore, contact etc.)
- [ ] Gather or plan site content: hero images, branding colours, fonts, logo, descriptions
- [ ] Get client contact details (phone, email, social links, address)
- [ ] Get or decide on the domain name

## 2. Copy the Site

- [ ] Copy an existing site folder into `sites/<new-site-name>-web/`
- [ ] Run `npm install` in the new folder for a clean dependency setup
- [ ] Update `src/lib/config.ts` with client-specific values (phone, booking URL etc.)
- [ ] Remove or add pages/components to match the features decided in step 1
- [ ] Update mock/fallback data or remove what's no longer relevant

## 3. Database

- [ ] Insert a new venue record (see SQL below)
- [ ] Generate a bcrypt password hash from the `pubweb-server` folder:
  ```bash
  node -e "const bcrypt = require('bcrypt'); bcrypt.hash('THE_PASSWORD', 10).then(h => console.log(h))"
  ```
- [ ] Insert an `app_user` record with the hashed password (see SQL below)
- [ ] Update `.env.local` in the new site folder with the new `VENUE_ID`
- [ ] Verify the client can log into the admin tool and sees an empty venue

### SQL Templates

```sql
-- Create the venue (replace values with actual details)
INSERT INTO venues (id, name, tagline, description, address_line1, town, county, postcode, phone, email)
VALUES (
  <VENUE_ID>,
  'Venue Name',
  'Tagline here',
  'Description here',
  'Address line 1',
  'Town',
  'County',
  'POSTCODE',
  '01onal number',
  'email@venue.com'
);

-- Create the admin user (use the bcrypt hash generated above)
INSERT INTO app_user (venue_id, email, password_hash, name, role)
VALUES (
  <VENUE_ID>,
  'admin@venue.com',
  '<BCRYPT_HASH>',
  'Admin Name',
  'admin'
);
```

## 4. Site Config & Verification

- [ ] Update `src/lib/config.ts` with the new venue's details (phone, booking URL, socials)
- [ ] Verify the admin login works for the new venue
- [ ] Confirm the new site runs locally (`npm run dev`) and loads data for the correct venue

## 5. Branding & Styling

- [ ] Update fonts in `layout.tsx`
- [ ] Update colour scheme in CSS/Tailwind config
- [ ] Replace metadata — site title, description, OG tags
- [ ] Replace favicon — delete default `src/app/favicon.ico` and copy the standard pubweb `src/app/icon.svg` (hexagon) from an existing site
- [ ] Replace or remove hero images and any hardcoded imagery

## 6. Cloudinary

- [ ] Create a new folder path in Cloudinary for this client's images
- [ ] Verify image uploads work through the admin tool for the new venue

## 7. Server Config

- [ ] Add the new site's domain to `ALLOWED_ORIGINS` in the server `.env`
- [ ] Restart the API server to pick up CORS changes

## 8. Deploy

- [ ] Create a new Vercel project for the site
- [ ] Set environment variables: `API_URL` (production), `VENUE_ID`
- [ ] Check revalidate time is set to production value (60s) not dev value (5s)
- [ ] Deploy and verify all pages load

## 9. Post-Launch Checks

- [ ] Client can log into admin tool and manage their content
- [ ] Changes made in admin appear on the live site (within cache time)
- [ ] Image uploads work (gallery, menus)
- [ ] All pages render correctly with real or placeholder data
- [ ] Mobile responsive check

---

## Notes

- The admin tool (pubweb-web) needs no changes — it already supports multiple venues
- Each site is an independent deployment with its own `VENUE_ID`
- Content can be skipped initially and added later through the admin tool
- Images from a previous site can be used as placeholders until real ones are ready
