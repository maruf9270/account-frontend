# 📚 Base Path & NextAuth Setup for Deployment

This project uses a **custom base path** (`/ahml`) for deployment instead of the default `/`.

This guide explains the setup for:

- `basePath` and `assetPrefix`
- Handling static assets and public files
- Correct configuration for NextAuth.js
- Important TODOs if the base path ever changes

---

## ➡️ Base Path & Asset Prefix Configuration

In `next.config.js`, set the following:

```javascript
module.exports = {
  basePath: "/ahml",
  assetPrefix: "/ahml",
  publicRuntimeConfig: {
    basePath: "/ahml",
  },
};
```

✅ This automatically updates:

- `<Link>` URLs
- `next/router` navigations
- Internal static asset references (CSS, JS)

---

## ➡️ Handling Links and Images

### Links (`<Link>` / `useRouter`)

No manual update is needed for internal links:

```jsx
<Link href="/about">About Page</Link>
```

➡️ Will automatically become:

```html
<a href="/ahml/about">About Page</a>
```

---

### Images (`next/image`)

You must **manually prefix** the `src` in `next/image`:

```jsx
import Image from "next/image";

export default function Home() {
  return (
    <Image
      src="/ahml/me.png"
      alt="Picture of the author"
      width={500}
      height={500}
    />
  );
}
```

❗Note: This only applies to raw file paths (images, videos, etc.).

---

## ➡️ NextAuth.js Configuration for Base Path

NextAuth.js needs extra configuration when using a base path.

### 1. Set the `NEXTAUTH_URL` Environment Variable

Add the following to your `.env.local` or `.env.production`:

```env
NEXTAUTH_URL=https://your-domain.com/ahml/api/auth
```

This ensures NextAuth API routes resolve correctly.

---

### 2. Configure `<SessionProvider>` in `_app.js`

Update `_app.js` to pass the `basePath`:

```jsx
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session} basePath="/ahml/api/auth">
      <Component {...pageProps} />
    </SessionProvider>
  );
}
```

✅ This makes sure NextAuth.js works properly with the new API route under `/ahml/api/auth`.

---

## 📝 Important Notes

- `basePath` must be set **at build time**.
- Changing the base path **requires a new `next build`**.
- **Restart** the server after any `.env` or `basePath` changes.
- **Manually prefix** static file paths (only if using raw HTML tags like `<img>` or `<video>`).

---

## 📋 TODO Checklist if Changing Base Path

| Task                                                    | Required? | Notes                                              |
| :------------------------------------------------------ | :-------- | :------------------------------------------------- |
| Update `basePath` and `assetPrefix` in `next.config.js` | ✅        |                                                    |
| Update `NEXTAUTH_URL` in `.env` files                   | ✅        | Must match the new path                            |
| Update `SessionProvider` `basePath` prop in `_app.js`   | ✅        |                                                    |
| Update manual `src` paths for images, videos, etc.      | ⚠️        | Only for raw `<img>`, `<video>`, etc.              |
| Rebuild with `npm run build`                            | ✅        | After making changes                               |
| Restart server                                          | ✅        |                                                    |
| Change .env .env.local nextauth_url with base path      |           | NEXTAUTH_URL=https://your-domain.com/ahml/api/auth |

---

## ✅ Final Deployment Checklist

- [ ] `next.config.js` updated
- [ ] `.env` updated with new `NEXTAUTH_URL`
- [ ] `_app.js` updated (`SessionProvider`)
- [ ] All image/public links tested
- [ ] Login/logout working via NextAuth
- [ ] `npm run build` successful
- [ ] Server restarted

---

# 🚀 Notes

Following this structure ensures smooth deployment under **any sub-path** (`/ahml`, `/docs`, `/app`, etc.) without breaking authentication or static assets.
