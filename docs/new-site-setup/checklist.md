# New Site Setup Checklist

Generic checklist for setting up a new venue website. Adapt as needed per client.

---

## 1. Planning

- [ ] Decide which pages/features the new site needs (menus, gallery, rooms, events, explore, contact etc.)
- [ ] Gather or plan site content: hero images, branding colours, fonts, logo, descriptions
- [ ] Get client contact details (phone, email, social links, address)
- [ ] Get or decide on the domain name

## 2. Database

- [ ] Insert a new record into the `venues` table
- [ ] Note the new `venue_id` — this is used everywhere
- [ ] Create an `app_user` record for the client (email + hashed password, linked to the new venue_id)
- [ ] Verify the client can log into the admin tool and sees an empty venue

## 3. Copy the Site

- [ ] Copy an existing site folder into `sites/<new-site-name>-web/`
- [ ] Update `.env.local` with the new `VENUE_ID`
- [ ] Update `src/lib/config.ts` with client-specific values (phone, booking URL etc.)
- [ ] Remove or add pages/components to match the features decided in step 1
- [ ] Update mock/fallback data or remove what's no longer relevant

## 4. Branding & Styling

- [ ] Update fonts in `layout.tsx`
- [ ] Update colour scheme in CSS/Tailwind config
- [ ] Replace metadata — site title, description, OG tags
- [ ] Replace favicon
- [ ] Replace or remove hero images and any hardcoded imagery

## 5. Cloudinary

- [ ] Create a new folder path in Cloudinary for this client's images
- [ ] Verify image uploads work through the admin tool for the new venue

## 6. Server Config

- [ ] Add the new site's domain to `ALLOWED_ORIGINS` in the server `.env`
- [ ] Restart the API server to pick up CORS changes

## 7. Deploy

- [ ] Create a new Vercel project for the site
- [ ] Set environment variables: `API_URL` (production), `VENUE_ID`
- [ ] Check revalidate time is set to production value (60s) not dev value (5s)
- [ ] Deploy and verify all pages load

## 8. Post-Launch Checks

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
