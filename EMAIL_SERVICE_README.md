# Email Service Documentation

## Overview
The email service automatically sends invoice notifications to **all administrators** when vendors complete order processing. Emails are sent in the background to avoid blocking API responses.

## Features
- ✅ Professional HTML email templates
- ✅ Background task processing (non-blocking)
- ✅ Automatic invoice generation
- ✅ Order completion notifications
- ✅ **Sends to all users with admin role**
- ✅ Support for multiple email providers (Gmail, Outlook, etc.)
- ✅ Configurable via environment variables

## Configuration

### 1. Email Provider Setup

#### For Gmail:
1. Enable 2-Factor Authentication in your Google Account
2. Generate an App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the generated 16-character password
3. Add to `.env`:
```bash
IHM_BACKEND_MAIL_USERNAME=your-email@gmail.com
IHM_BACKEND_MAIL_PASSWORD=your-16-char-app-password
IHM_BACKEND_MAIL_SERVER=smtp.gmail.com
IHM_BACKEND_MAIL_PORT=587
```

#### For Outlook/Office365:
```bash
IHM_BACKEND_MAIL_USERNAME=your-email@outlook.com
IHM_BACKEND_MAIL_PASSWORD=your-password
IHM_BACKEND_MAIL_SERVER=smtp.office365.com
IHM_BACKEND_MAIL_PORT=587
```

### 2. Environment Variables

Add these to your `.env` file:

```bash
# Email Configuration
IHM_BACKEND_MAIL_USERNAME=your-email@gmail.com
IHM_BACKEND_MAIL_PASSWORD=your-app-password
IHM_BACKEND_MAIL_SERVER=smtp.gmail.com
IHM_BACKEND_MAIL_PORT=587
IHM_BACKEND_MAIL_FROM=your-email@gmail.com
IHM_BACKEND_MAIL_FROM_NAME=FUMU - Food Management System
IHM_BACKEND_MAIL_STARTTLS=True
IHM_BACKEND_MAIL_SSL_TLS=False
IHM_BACKEND_ADMIN_EMAIL=admin@admin.com
```

## How It Works

### Workflow:
1. **Vendor processes order** → Updates order with delivered quantities and prices
2. **Vendor marks order as completed** → Triggers email sending
3. **Background task created** → Email sent asynchronously
4. **All admins receive email** → Professional invoice with all details

### Email Recipients:
- The system automatically fetches **all users with the ADMIN role**
- Each admin user receives a copy of the invoice
- If no admin users are found in database, falls back to `ADMIN_EMAIL` from settings
- Email addresses are validated before sending

### Email Trigger Point:
```python
# In vendor endpoint: POST /api/vendor/orders/{order_id}/update-status
# When mark_as_completed = True
{
    "items": [...],
    "mark_as_completed": true  # ← Triggers email
}
```

### What's Included in Email:
- Invoice number (Order ID)
- Order date and processing date
- Vendor information
- Order status
- Complete item breakdown:
  - Item names
  - Requested quantities
  - Delivered quantities
  - Unit prices
  - Item totals
- Grand total
- Professional formatting with company branding

## API Integration

### Vendor Update Order Endpoint
```python
POST /api/vendor/orders/{order_id}/update-status
```

**Request Body:**
```json
{
  "items": [
    {
      "item_id": "uuid",
      "delivered_quantity": 10,
      "unit_price": 40.50
    }
  ],
  "mark_as_completed": true
}
```

**Response:**
```json
{
  "message": "Order status updated successfully",
  "order_id": "order-uuid",
  "email_scheduled": true
}
```

## Email Service Functions

### 1. `send_invoice_email()`
Sends complete invoice email with all order details to all admin users.

**Parameters:**
- `recipients`: List of email addresses (all admin users)
- `order_data`: Dictionary with order information

**Features:**
- ✅ Validates email addresses
- ✅ Handles multiple recipients
- ✅ Error handling to prevent API failures
- ✅ Logging for debugging

**Usage:**
```python
from ihm_backend.services.email import send_invoice_email

order_data = {
    'order_id': 'uuid',
    'order_date': '2025-11-22',
    'status': 'completed',
    'total_items': 5,
    'total_price': 2450.00,
    'items': [...],
    'vendor_name': 'vendor@email.com'
}

# Send to multiple admins
await send_invoice_email(['admin1@email.com', 'admin2@email.com'], order_data)
```

### 2. `send_order_notification_email()`
Sends simple status update notification.

**Parameters:**
- `recipients`: List of email addresses
- `order_id`: Order ID
- `vendor_name`: Vendor name
- `total_items`: Number of items
- `status`: Order status

## Background Tasks

Emails are sent using FastAPI's `BackgroundTasks` to ensure:
- ✅ API responds immediately
- ✅ Email sending doesn't block the request
- ✅ Better user experience
- ✅ Handles email failures gracefully

**Implementation:**
```python
from fastapi import BackgroundTasks

@router.post("/endpoint")
async def endpoint(background_tasks: BackgroundTasks, db: AsyncSession):
    # ... process order ...
    
    # Get all admin users
    admin_result = await db.execute(
        select(User).where(User.role == UserRole.ADMIN)
    )
    admin_users = admin_result.scalars().all()
    
    # Collect all admin emails
    admin_emails = [admin.email for admin in admin_users if admin.email]
    
    # Fallback to settings if no admin users found
    if not admin_emails:
        admin_emails = [settings.admin_email]
    
    # Schedule email in background to all admins
    if admin_emails:
        background_tasks.add_task(
            send_invoice_email,
            admin_emails,
            order_data
        )
    
    return {"message": "Success"}
```

## Multiple Admin Users

### How It Works:
1. **Query Database** - System fetches all users with `role = ADMIN`
2. **Extract Emails** - Collects email addresses from all admin users
3. **Validate** - Filters out empty/invalid emails
4. **Send** - Sends one email with all admins in recipients list
5. **Fallback** - Uses `ADMIN_EMAIL` from settings if no admin users found

### Benefits:
- ✅ **All admins notified** - No one misses important updates
- ✅ **Automatic** - No manual configuration needed
- ✅ **Scalable** - Add/remove admins easily
- ✅ **Fallback** - Still works if no admin users in database

### Example:
```python
# Admin users in database:
# - admin1@company.com
# - admin2@company.com
# - admin3@company.com

# All three will receive the invoice email automatically
```

## Testing

### 1. Test Email Configuration
```python
# Run this to test email setup
poetry run python -c "
from ihm_backend.services.email import send_order_notification_email
import asyncio

asyncio.run(send_order_notification_email(
    ['test@example.com'],
    'test-order-123',
    'Test Vendor',
    5
))
"
```

### 2. Test Full Workflow
1. Start the backend server
2. Login as vendor
3. Go to "Incoming Orders"
4. Update quantities and prices
5. Click "Update Order Status"
6. Check admin email inbox

## Email Template Features

### Visual Design:
- Professional gradient header (purple theme)
- Responsive layout
- Clean typography
- Color-coded status badges
- Structured table layout
- Clear total section
- Footer with timestamp

### Content:
- Invoice number and date
- Vendor details
- Order status badge
- Item-by-item breakdown
- Unit prices and totals
- Grand total with emphasis
- Automated notification note

## Troubleshooting

### Common Issues:

**1. Email not sending:**
- Check email credentials in `.env`
- Verify SMTP server and port
- For Gmail, ensure App Password is used (not regular password)
- Check if 2FA is enabled for Gmail

**2. Email goes to spam:**
- Add sender email to contacts
- Check SPF/DKIM records if using custom domain
- Verify `MAIL_FROM` matches `MAIL_USERNAME`

**3. SSL/TLS errors:**
- For port 587: Set `MAIL_STARTTLS=True`, `MAIL_SSL_TLS=False`
- For port 465: Set `MAIL_STARTTLS=False`, `MAIL_SSL_TLS=True`

**4. Background task not running:**
- Check server logs for errors
- Ensure FastAPI version supports BackgroundTasks
- Verify email service imports are correct

## Security Best Practices

1. ✅ Never commit email passwords to git
2. ✅ Use App Passwords instead of account passwords
3. ✅ Store credentials in `.env` file only
4. ✅ Add `.env` to `.gitignore`
5. ✅ Use environment variables in production
6. ✅ Enable 2FA on email accounts
7. ✅ Rotate passwords regularly

## Production Deployment

### Environment Variables:
Set these in your production environment (Docker, Heroku, etc.):

```bash
IHM_BACKEND_MAIL_USERNAME=production-email@domain.com
IHM_BACKEND_MAIL_PASSWORD=secure-app-password
IHM_BACKEND_ADMIN_EMAIL=admin@domain.com
# ... other settings
```

### Monitoring:
- Log email sending attempts
- Monitor failure rates
- Set up alerts for email service failures
- Track delivery rates

## Future Enhancements

Potential improvements:
- [ ] Email templates for different order statuses
- [ ] Email attachments (PDF invoices)
- [ ] Email queuing with Redis
- [ ] Retry mechanism for failed emails
- [ ] Email analytics and tracking
- [ ] BCC option for secondary recipients
- [ ] Custom email templates via admin panel
- [ ] Email notifications for chefs when orders are compiled
- [ ] Individual email preferences per admin user
- [ ] Email delivery confirmation

## Managing Admin Users

### Adding New Admin Users:
When you create a new user with admin role, they automatically start receiving invoice emails:

```python
POST /api/auth/register
{
    "email": "newadmin@company.com",
    "password": "secure-password",
    "role": "admin",
    "is_active": true,
    "is_verified": true
}
```

### Removing Admin from Email List:
- Change user role from `admin` to another role
- Or deactivate the user (`is_active = false`)
- They will no longer receive invoice emails

### Viewing Current Admin Users:
```python
GET /api/users
# Filter by role = admin
```

### Best Practices:
1. ✅ Ensure all admin users have valid email addresses
2. ✅ Test email delivery when adding new admins
3. ✅ Keep admin email addresses up to date
4. ✅ Use professional email addresses (avoid personal emails)
5. ✅ Set up email forwarding/distribution lists if needed

## Support

For issues or questions:
1. Check logs: `poetry run python -m ihm_backend`
2. Verify email settings in `.env`
3. Test email configuration
4. Review error messages in console

## Examples

### Email Preview (Text Version):

```
INVOICE
FUMU - Food Management System

Invoice #: A1B2C3D4
Date: 2025-11-22

Vendor: vendor@email.com
Status: COMPLETED
Total Items: 3

Order Items:
┌──────────────┬──────────┬───────────┬────────────┬──────────┐
│ Item         │ Quantity │ Delivered │ Unit Price │ Total    │
├──────────────┼──────────┼───────────┼────────────┼──────────┤
│ Tomatoes     │ 10 kg    │ 10 kg     │ ₹40.00     │ ₹400.00  │
│ Onions       │ 15 kg    │ 15 kg     │ ₹20.00     │ ₹300.00  │
│ Rice         │ 25 kg    │ 25 kg     │ ₹50.00     │ ₹1,250.00│
└──────────────┴──────────┴───────────┴────────────┴──────────┘

Total Amount: ₹1,950.00

Note: This is an automatically generated invoice.
```

---

**Version:** 1.0  
**Last Updated:** 2025-11-22  
**Maintained by:** FUMU Development Team
