# Deploying PracticeForge to your own server (Docker)

You run the commands; the app runs in an **isolated container** bound to
`127.0.0.1:3100`, so it cannot clash with the other systems on the box. nginx
reverse-proxies your domain to it.

> ⚠️ First: **change the root password** you shared, and prefer a non-root sudo
> user for daily ops. Run each step and read its output before the next.

---

## Option A — Auto-deploy via GitHub Actions (recommended, hands-off)

`.github/workflows/deploy.yml` deploys `main` to your server automatically on
every push. You never share your password with anyone — add an **SSH deploy key**
to GitHub repo Secrets instead:

1. Generate a key locally: `ssh-keygen -t ed25519 -f pf_deploy -N ""`
2. On the server: append `pf_deploy.pub` to `~/.ssh/authorized_keys`
   (ideally for a `deploy` user, not root).
3. GitHub → repo → Settings → Secrets and variables → Actions → add:
   `SSH_HOST=45.143.11.97`, `SSH_USER=deploy`, `SSH_PORT=22`,
   `SSH_KEY=`(contents of the private `pf_deploy` file).
4. Push to `main` (or run the workflow manually) → it pulls, builds the container,
   health-checks, and goes live. Re-run after adding secrets if the first run failed.

Requires Docker + the nginx step (Section 5) once. After that it's fully automatic.

---

## Option B — Manual deploy (run it yourself)

## 0. Pre-flight checks (don't skip — protects your other services)

```bash
# Is Docker installed?
docker --version && docker compose version

# Is port 3100 free? (no output = free)
ss -ltnp | grep ':3100' || echo "3100 is free"

# Is nginx the web server, and what sites already exist?
nginx -v && ls /etc/nginx/sites-enabled/

# How much disk/RAM is free (a build needs ~1–2 GB)
df -h / && free -m
```

If Docker is missing: `curl -fsSL https://get.docker.com | sh` (review first).
If you use **Apache/Caddy** instead of nginx, tell me and I'll give that config.

## 1. Get the code

The latest work lives on `feat/saas-foundation`. Merge it into `main` first
(ask me to do `feat → main` locally, or do it on GitHub), then on the server:

```bash
sudo mkdir -p /opt/practiceforge && cd /opt/practiceforge
# first time:
git clone https://github.com/uSoyrac/personinapp.git .
# later updates:
git pull origin main
```

## 2. Environment

```bash
cp .env.example .env.production
nano .env.production
```
- The site runs as the **public demo** if these are empty — safe to launch first
  with just `NEXT_PUBLIC_SITE_URL=https://YOURDOMAIN.com`.
- Fill Supabase / Stripe / Resend keys later to switch on auth/payments/email.
- `.env.production` is gitignored — never commit it.

## 3. Build + run (isolated)

```bash
docker compose up -d --build
docker compose logs -f --tail=50   # watch it boot, then Ctrl-C
```

## 4. Health check BEFORE exposing it

```bash
curl -I http://127.0.0.1:3100/            # expect HTTP/1.1 200
curl -s http://127.0.0.1:3100/sitemap.xml | head
```
Only continue if these return 200. Nothing is public yet.

## 5. Point your domain (nginx)

```bash
sudo cp deploy/nginx-practiceforge.conf /etc/nginx/sites-available/practiceforge.conf
sudo sed -i 's/YOURDOMAIN.com/yourrealdomain.com/g' /etc/nginx/sites-available/practiceforge.conf
sudo ln -s /etc/nginx/sites-available/practiceforge.conf /etc/nginx/sites-enabled/
sudo nginx -t          # MUST say "syntax is ok" — this won't touch other sites
sudo systemctl reload nginx
```
Point your domain's DNS A-record to `45.143.11.97` if not already.

## 6. HTTPS

```bash
sudo certbot --nginx -d yourrealdomain.com -d www.yourrealdomain.com
```

## 7. Verify live (incl. the "already done?" items)

```bash
curl -sI https://yourrealdomain.com/                  # 200
curl -s  https://yourrealdomain.com/ | grep -c '"@type":"Organization"'   # 1 = schema live
curl -s  https://yourrealdomain.com/pricing | grep -c '"@type":"FAQPage"' # 1 = FAQ schema live
```
Open the site: check /login, /signup, /pricing toggle, /academy, cookie banner.

## 8. Future updates (redeploy)

```bash
cd /opt/practiceforge && git pull origin main && docker compose up -d --build
```

---

### Don't want to manage a server?
Connecting this repo to **Vercel** (free) deploys `main` automatically with zero
server risk and no impact on your other systems — recommended if you're unsure.
