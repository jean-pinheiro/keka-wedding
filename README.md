# Wedding Website

A beautiful, full-featured wedding website with gift reservations, RSVP functionality, photo carousel, and admin panel. Built with Next.js, Supabase, and Resend.

## Features

- 🎁 **Gift Reservation System** - Guests can reserve gifts with optional Pix payment integration
- 📝 **RSVP Management** - Simple form for guests to confirm attendance
- 📸 **Photo Carousel** - Beautiful image gallery with auto-play and navigation
- 🗺️ **Location Map** - Embedded Google Maps for ceremony location
- 👨‍💼 **Admin Dashboard** - Complete management interface for gifts, photos, RSVPs, and settings
- 📧 **Email Notifications** - Automated emails via Resend for reservations and RSVPs
- 🎨 **Responsive Design** - Beautiful, mobile-first design with romantic theme
- 🔐 **Secure Admin Access** - Password-protected admin panel

## Tech Stack

- **Framework**: Next.js 14+ with App Router and TypeScript
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Email**: Resend for transactional emails
- **Styling**: Tailwind CSS with shadcn/ui components
- **Carousel**: Embla Carousel React
- **Icons**: Lucide React
- **Deployment**: Vercel

## Quick Start

### 1. Clone and Install

\`\`\`bash
git clone <your-repo-url>
cd wedding-website
npm install
\`\`\`

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the contents of \`supabase/schema.sql\` to create tables and policies
4. Optionally run \`scripts/seed-sample-data.sql\` for demo data
5. Get your project URL and keys from Settings > API

### 3. Set Up Resend

1. Create an account at [resend.com](https://resend.com)
2. Add and verify your domain (or use their test domain for development)
3. Create an API key in the dashboard

### 4. Environment Variables

Create a \`.env.local\` file in the root directory:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Email Configuration
RESEND_API_KEY=your_resend_api_key
OWNER_EMAIL=your_email@domain.com

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
ADMIN_PASS=your_secure_admin_password
\`\`\`

### 5. Run Locally

\`\`\`bash
npm run dev
\`\`\`

Visit [http://localhost:3000](http://localhost:3000) to see your wedding website!

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add all environment variables in the Vercel dashboard
4. Deploy!

The site will be automatically deployed on every push to your main branch.

## Configuration Guide

### Admin Access

1. Visit \`/admin\` on your deployed site
2. Enter the password you set in \`ADMIN_PASS\`
3. Manage all aspects of your wedding website

### Site Settings

In the admin panel, configure:

- **Cover Title & Subtitle**: Main homepage text
- **Location Address**: Ceremony venue address
- **Maps Embed URL**: Google Maps embed code
- **Global Pix Settings**: Default payment QR code and link

### Gift Management

- **Add Gifts**: Name, description, image URL, and status
- **Per-Gift Pix**: Override global Pix settings for specific gifts
- **Status Tracking**: Available → Reserved → Paid
- **Reservation Details**: View who reserved each gift

### Photo Gallery

- **Add Photos**: Image URL and optional caption
- **Sort Order**: Control the sequence in the carousel
- **Auto-Play**: Carousel automatically advances every 5 seconds

### RSVP Monitoring

- View all guest responses with attendance status
- See optional messages from guests
- Track submission timestamps

## Pix Payment Integration

This website supports Brazilian Pix payments for gift reservations:

### Global Pix Configuration

Set default Pix payment information in Site Settings:
- **Pix QR URL**: Link to your Pix QR code image
- **Pix Link URL**: Direct payment link (from your bank app)
- **Instructions**: Text shown to guests

### Per-Gift Pix Override

Individual gifts can have their own Pix settings that override the global defaults.

### Guest Experience

1. Guest selects a gift and fills in their details
2. Guest chooses "Sim, via Pix" for Pix payment
3. Gift is immediately reserved and Pix payment info is displayed
4. Both guest and admin receive email notifications

## Email Notifications

The system sends automatic emails for:

- **Gift Reservations**: Confirmation to guest, notification to admin
- **RSVP Submissions**: Notification to admin with guest details

### Email Configuration

- Emails are sent from \`noreply@yourdomain.com\`
- Admin notifications go to the \`OWNER_EMAIL\` address
- For production, ensure your domain is verified in Resend

## Customization

### Styling

The site uses a romantic rose color scheme. To customize:

1. Edit the color variables in \`app/globals.css\`
2. Update the rose color classes in components (e.g., \`bg-rose-600\`)
3. Modify the gradient in the hero section

### Content

- Update the default titles in \`app/page.tsx\`
- Modify email templates in \`src/lib/email.ts\`
- Customize form labels and messages throughout the components

## Database Schema

The application uses four main tables:

- **gifts**: Gift items with reservation status and Pix settings
- **photos**: Carousel images with captions and sort order
- **rsvps**: Guest responses with attendance and messages
- **site_settings**: Global configuration and Pix defaults

All tables have Row Level Security enabled with public read access and controlled write access.

## Security Features

- **Admin Authentication**: Password-protected admin panel with secure cookies
- **Row Level Security**: Database-level access control
- **Input Validation**: Server-side validation for all forms
- **CSRF Protection**: Built-in Next.js CSRF protection
- **Environment Variables**: Sensitive data stored securely

## Troubleshooting

### Common Issues

**Admin login not working**
- Check that \`ADMIN_PASS\` is set in environment variables
- Clear browser cookies and try again

**Emails not sending**
- Verify \`RESEND_API_KEY\` is correct
- Check that your domain is verified in Resend
- Ensure \`OWNER_EMAIL\` is set for admin notifications

**Images not loading**
- Verify image URLs are publicly accessible
- Check that URLs use HTTPS for production sites

**Database connection issues**
- Confirm Supabase environment variables are correct
- Check that RLS policies are properly configured
- Verify the schema was created successfully

### Getting Help

If you encounter issues:

1. Check the browser console for error messages
2. Review the Vercel deployment logs
3. Verify all environment variables are set correctly
4. Ensure your Supabase project is active and accessible

## License

This project is open source and available under the MIT License.

---

**Made with ❤️ for your special day**
\`\`\`

Enjoy your beautiful wedding website! 🎉
