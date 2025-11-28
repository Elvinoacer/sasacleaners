# Project Pages Documentation

This document lists all the pages in the SaSa Cleaners application, organized by their role (Public vs. Admin).

## Public Pages
These pages are accessible to all visitors.

| Route | File Path | Description |
| :--- | :--- | :--- |
| `/` | [app/page.tsx](file:///home/elvin/Projects/businesses/portfolios/cleaning-service/app/page.tsx) | **Home Page**. The landing page featuring the hero section, services highlight, about section, and testimonials preview. |
| `/services` | [app/services/page.tsx](file:///home/elvin/Projects/businesses/portfolios/cleaning-service/app/services/page.tsx) | **Services Page**. Lists all available cleaning services with details. |
| `/portfolio` | [app/portfolio/page.tsx](file:///home/elvin/Projects/businesses/portfolios/cleaning-service/app/portfolio/page.tsx) | **Portfolio Page**. Showcases galleries of past cleaning work (Before/After, etc.). |
| `/testimonials` | [app/testimonials/page.tsx](file:///home/elvin/Projects/businesses/portfolios/cleaning-service/app/testimonials/page.tsx) | **Testimonials Page**. Displays client reviews and allows users to submit new feedback. |
| `/contact` | [app/contact/page.tsx](file:///home/elvin/Projects/businesses/portfolios/cleaning-service/app/contact/page.tsx) | **Contact Page**. Contains contact information and an inquiry form. |

## Admin Pages
These pages are protected and require authentication.

| Route | File Path | Description |
| :--- | :--- | :--- |
| `/admin` | [app/admin/page.tsx](file:///home/elvin/Projects/businesses/portfolios/cleaning-service/app/admin/page.tsx) | **Admin Dashboard**. The main overview page for the admin area. |
| `/admin/login` | [app/admin/login/page.tsx](file:///home/elvin/Projects/businesses/portfolios/cleaning-service/app/admin/login/page.tsx) | **Admin Login**. Authentication page for administrators. |
| `/admin/services` | [app/admin/services/page.tsx](file:///home/elvin/Projects/businesses/portfolios/cleaning-service/app/admin/services/page.tsx) | **Manage Services**. Interface to create, edit, or delete service listings. |
| `/admin/portfolio` | [app/admin/portfolio/page.tsx](file:///home/elvin/Projects/businesses/portfolios/cleaning-service/app/admin/portfolio/page.tsx) | **Manage Portfolio**. Interface to upload and manage portfolio images. |
| `/admin/testimonials` | [app/admin/testimonials/page.tsx](file:///home/elvin/Projects/businesses/portfolios/cleaning-service/app/admin/testimonials/page.tsx) | **Manage Testimonials**. Interface to approve or delete client testimonials. |
| `/admin/contact` | [app/admin/contact/page.tsx](file:///home/elvin/Projects/businesses/portfolios/cleaning-service/app/admin/contact/page.tsx) | **View Inquiries**. Interface to view messages sent via the contact form. |

## Total Pages: 11
*Last Updated: 2025-11-28*
