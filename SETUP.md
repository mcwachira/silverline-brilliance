# Setup Instructions for Silverline Admin Dashboard

## Current Status

The admin dashboard is currently using a **mock Supabase client** for development. This allows the application to build and run without requiring the actual Supabase packages to be installed.

## To Install Real Supabase Packages

Once npm is working properly, run these commands:

```bash
# Install Supabase packages
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# Install other missing packages
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder @tiptap/extension-text-align @tiptap/extension-code-block-lowlight lowlight react-dropzone jspdf jspdf-autotable html2canvas nodemailer react-email @react-email/components react-hot-toast @radix-ui/react-dropdown-menu @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-checkbox @radix-ui/react-tabs
```

## After Installing Real Packages

1. **Remove the mock client**:
   ```bash
   rm lib/supabase/mock-client.ts
   ```

2. **Update the imports** in these files:
   - `middleware.ts`: Change `import { createClient } from './lib/supabase/mock-client';` to `import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';`
   - `lib/supabase/client.ts`: Change `import { createClient } from './mock-client';` to `import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';`
   - `lib/supabase/server.ts`: Change `import { createClient } from './mock-client';` to `import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';`
   - `app/api/bookings/route.ts`: Change `import { createClient } from '@/lib/supabase/mock-client';` to `import { createClient } from '@supabase/supabase-js';`
   - `app/api/bookings/[id]/route.ts`: Change `import { createClient } from '@/lib/supabase/mock-client';` to `import { createClient } from '@supabase/supabase-js';`

3. **Update the client initialization**:
   - In `lib/supabase/client.ts`: `export const supabase = createClientComponentClient();`
   - In `lib/supabase/server.ts`: 
     ```typescript
     import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
     import { cookies } from 'next/headers';
     
     export const supabaseServer = createServerComponentClient({
       cookies,
     });
     ```

4. **Update middleware** to use the real auth helpers:
   ```typescript
   import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
   import { NextResponse } from 'next/server';
   import type { NextRequest } from 'next/server';

   export async function middleware(req: NextRequest) {
     const res = NextResponse.next();
     const supabase = createMiddlewareClient({ req, res });

     const {
       data: { session },
     } = await supabase.auth.getSession();

     // ... rest of the middleware logic
   }
   ```

## Environment Variables

Make sure your `.env.local` file contains:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_sanity_api_token

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

## Database Setup

Run the SQL commands from `DATABASE_SCHEMA.md` in your Supabase SQL editor.

## Current Mock Features

The mock client provides:
- ✅ Authentication (login with admin@silverlinetech.com / admin123)
- ✅ Bookings data with sample records
- ✅ Basic database operations (select, filter, order, paginate)
- ✅ Error handling for missing records

## What's Not Mocked

- ❌ Real-time subscriptions
- ❌ File uploads to Supabase Storage
- ❌ Email sending (nodemailer)
- ❌ PDF generation (jsPDF)
- ❌ Rich text editor (Tiptap)

These features will work once the real packages are installed and configured.

## Running the Application

With the mock client, you can run:

```bash
npm run dev
```

The application will be available at `http://localhost:3000` and you can:
- Login with admin@silverlinetech.com / admin123
- View the dashboard
- Browse bookings
- Access settings
- Test the UI/UX

The mock data will provide a realistic development experience until you're ready to connect to real Supabase.
