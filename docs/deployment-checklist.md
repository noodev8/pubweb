# Deployment Checklist

## nagsheadgarthmyl-web (Frontend Website)

### Before Deployment

- [ ] **Cache time**: Change `revalidate: 5` back to `revalidate: 60` in `src/lib/services/venue.ts:38`
- [ ] **API URL**: Ensure `API_URL` in `.env` points to production API server
- [ ] **Venue ID**: Confirm `VENUE_ID` in `.env` is correct

### Environment Variables (.env)

```
API_URL=https://api.yourdomain.com
VENUE_ID=1
```

---

## venuemanager-web (Admin Tool)

### Before Deployment

- [ ] **API URL**: Ensure `NEXT_PUBLIC_API_URL` in `.env.local` points to production API
- [ ] **Cloudinary**: Confirm `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` are set

### Environment Variables (.env.local)

```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dnrevr0pi
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=pubweb
```

---

## venuemanager-express (API Server)

### Before Deployment

- [ ] **Database**: Ensure `config/config.js` has production database credentials
- [ ] **JWT Secret**: Set a strong `JWT_SECRET` in environment
- [ ] **CORS**: Update allowed origins for production domains

### Environment Variables

```
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=pubweb
DB_USER=your-user
DB_PASSWORD=your-password
JWT_SECRET=your-secret-key
```

---

## Post-Deployment Checks

- [ ] Admin login works
- [ ] Changes in admin appear on website (within cache time)
- [ ] Menu images upload successfully
- [ ] All pages load without errors
