# 3d.io Floor Plan App

Live demo: https://spaces.archilogic.com/order

* Converts floor plans into [basic 3d models](https://3d.io/floor-plan-to-3d-conversion.html) using 3d.io APIs.
* Stores conversion related info in your database.
* Sends email notification to your cutomer when 3d model is ready.

## Install

### 1. **Setup services:**

* [**Setup 3d.io**](docs/3dio.md) - Floor plan conversion service
* [**Setup SendGrid**](docs/sendgrid.md) - Email service

### 3. **Set environment variables**

Name | Notes
--- | ---
**PUBLIC_SERVER_URL** | The URL where your server is publicly accessible. To obtain a public URL for local development use [ngrok.com](https://ngrok.com).<br>Example: `https://my-project.herokuapp.com/`
**EMAIL_FROM** | Emails to your customers will have this email address in the "from" field.<br>Example: `floor-plan@your-domain.com`
**EMAIL_ADMIN** | Email of the administrator responsible for this server. Error notifications will be send here.<br>Example: `admin@your-domain.com`
**IO3D_SECRET_API_KEY** | Example: `51ebcf63-d5d...`
**SENDGRID_API_KEY** | Example: `SG.wBcemOAdRZ-yC-ZwzVhS...`
**REDIS_URL** | Example: `redis://localhost:6379`

### 4. **Optional: Modify email messages to your customers in:**
* [api/convert-floor-plan-to-3d.js](https://github.com/archilogic-com/3dio-floor-plan-app/blob/master/api/convert-floor-plan-to-3d.js#L86)
* [api/on-conversion-status-update.js](https://github.com/archilogic-com/3dio-floor-plan-app/blob/master/api/on-conversion-status-update.js#L74)
