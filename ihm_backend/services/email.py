"""Email service for sending notifications."""
from typing import List, Optional
from datetime import datetime
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from ihm_backend.settings import settings


# Email configuration
conf = ConnectionConfig(
    MAIL_USERNAME=settings.mail_username,
    MAIL_PASSWORD=settings.mail_password,
    MAIL_FROM=settings.mail_from,
    MAIL_PORT=settings.mail_port,
    MAIL_SERVER=settings.mail_server,
    MAIL_FROM_NAME=settings.mail_from_name,
    MAIL_STARTTLS=settings.mail_starttls,
    MAIL_SSL_TLS=settings.mail_ssl_tls,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)


def generate_invoice_email_html(order_data: dict) -> str:
    """
    Generate HTML email template for invoice.
    
    Args:
        order_data: Dictionary containing order information
        
    Returns:
        HTML string for email body
    """
    order_id = order_data.get('order_id', 'N/A')
    order_date = order_data.get('order_date', datetime.now().strftime('%Y-%m-%d'))
    status = order_data.get('status', 'completed')
    total_items = order_data.get('total_items', 0)
    total_price = order_data.get('total_price', 0)
    items = order_data.get('items', [])
    vendor_name = order_data.get('vendor_name', 'Vendor')
    
    # Generate items table rows
    items_html = ""
    for item in items:
        item_name = item.get('item_name', '')
        quantity = item.get('total_quantity', 0)
        delivered = item.get('delivered_quantity', quantity)
        unit = item.get('unit', 'kg')
        unit_price = item.get('unit_price', 0)
        item_total = item.get('total_price', 0)
        
        items_html += f"""
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">{item_name}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">{quantity} {unit}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">{delivered} {unit}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹{unit_price:.2f}</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">₹{item_total:.2f}</td>
        </tr>
        """
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Invoice - FUMU</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f3f4f6;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="padding: 40px 0;">
                    <table role="presentation" style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%); padding: 30px; text-align: center;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">INVOICE</h1>
                                <p style="margin: 10px 0 0 0; color: #e9d5ff; font-size: 16px;">FUMU - Food Management System</p>
                            </td>
                        </tr>
                        
                        <!-- Invoice Info -->
                        <tr>
                            <td style="padding: 30px;">
                                <table style="width: 100%; margin-bottom: 30px;">
                                    <tr>
                                        <td>
                                            <p style="margin: 0; color: #6b7280; font-size: 14px;">Invoice #</p>
                                            <p style="margin: 5px 0 0 0; color: #111827; font-size: 16px; font-weight: 600;">{order_id[:8].upper()}</p>
                                        </td>
                                        <td style="text-align: right;">
                                            <p style="margin: 0; color: #6b7280; font-size: 14px;">Date</p>
                                            <p style="margin: 5px 0 0 0; color: #111827; font-size: 16px; font-weight: 600;">{order_date}</p>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Order Summary -->
                                <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                                    <table style="width: 100%;">
                                        <tr>
                                            <td style="padding: 8px 0;">
                                                <span style="color: #6b7280; font-size: 14px;">Vendor:</span>
                                                <strong style="color: #111827; margin-left: 10px;">{vendor_name}</strong>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0;">
                                                <span style="color: #6b7280; font-size: 14px;">Status:</span>
                                                <span style="display: inline-block; margin-left: 10px; padding: 4px 12px; background-color: #dcfce7; color: #166534; border-radius: 4px; font-size: 12px; font-weight: 600; text-transform: uppercase;">{status}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0;">
                                                <span style="color: #6b7280; font-size: 14px;">Total Items:</span>
                                                <strong style="color: #111827; margin-left: 10px;">{total_items}</strong>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                
                                <!-- Items Table -->
                                <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 18px;">Order Items</h3>
                                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                                    <thead>
                                        <tr style="background-color: #f9fafb;">
                                            <th style="padding: 12px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Item</th>
                                            <th style="padding: 12px; text-align: center; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Quantity</th>
                                            <th style="padding: 12px; text-align: center; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Delivered</th>
                                            <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Unit Price</th>
                                            <th style="padding: 12px; text-align: right; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase;">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items_html}
                                    </tbody>
                                </table>
                                
                                <!-- Total -->
                                <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px;">
                                    <table style="width: 100%;">
                                        <tr>
                                            <td style="padding: 8px 0;">
                                                <span style="color: #6b7280; font-size: 14px;">Subtotal:</span>
                                            </td>
                                            <td style="text-align: right; padding: 8px 0;">
                                                <span style="color: #111827; font-weight: 600;">₹{total_price:.2f}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 12px 0; border-top: 2px solid #5b21b6;">
                                                <span style="color: #111827; font-size: 18px; font-weight: 700;">Total Amount:</span>
                                            </td>
                                            <td style="text-align: right; padding: 12px 0; border-top: 2px solid #5b21b6;">
                                                <span style="color: #5b21b6; font-size: 20px; font-weight: 700;">₹{total_price:.2f}</span>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                
                                <!-- Note -->
                                <div style="margin-top: 30px; padding: 15px; background-color: #eff6ff; border-left: 4px solid #5b21b6; border-radius: 4px;">
                                    <p style="margin: 0; color: #1e40af; font-size: 14px;">
                                        <strong>Note:</strong> This is an automatically generated invoice. The vendor has completed processing this order.
                                    </p>
                                </div>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                                    FUMU - Food Management System<br>
                                    Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
    
    return html


async def send_invoice_email(
    recipients: List[str],
    order_data: dict
) -> None:
    """
    Send invoice email to recipients.
    
    Args:
        recipients: List of email addresses (all admin users)
        order_data: Dictionary containing order information
    """
    order_id = order_data.get('order_id', 'N/A')
    
    # Filter out empty emails
    valid_recipients = [email for email in recipients if email and email.strip()]
    
    if not valid_recipients:
        print("Warning: No valid email recipients found")
        return
    
    html_content = generate_invoice_email_html(order_data)
    
    message = MessageSchema(
        subject=f"Order Invoice #{order_id[:8].upper()} - FUMU",
        recipients=valid_recipients,
        body=html_content,
        subtype=MessageType.html
    )
    
    fm = FastMail(conf)
    
    try:
        await fm.send_message(message)
        print(f"Invoice email sent successfully to {len(valid_recipients)} admin(s)")
    except Exception as e:
        print(f"Failed to send invoice email: {e}")
        # Don't raise exception to avoid breaking the API call


async def send_order_notification_email(
    recipients: List[str],
    order_id: str,
    vendor_name: str,
    total_items: int,
    status: str = "completed"
) -> None:
    """
    Send order status notification email.
    
    Args:
        recipients: List of email addresses
        order_id: Order ID
        vendor_name: Name of the vendor
        total_items: Number of items in order
        status: Order status
    """
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Order Notification</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f3f4f6; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 30px;">
            <h2 style="color: #5b21b6; margin-top: 0;">Order Status Update</h2>
            <p>An order has been processed by the vendor.</p>
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Order ID:</strong> {order_id[:8].upper()}</p>
                <p><strong>Vendor:</strong> {vendor_name}</p>
                <p><strong>Total Items:</strong> {total_items}</p>
                <p><strong>Status:</strong> <span style="color: #16a34a; font-weight: bold;">{status}</span></p>
            </div>
            <p>You can view the full invoice details in your admin dashboard.</p>
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                This is an automated notification from FUMU - Food Management System
            </p>
        </div>
    </body>
    </html>
    """
    
    message = MessageSchema(
        subject=f"Order {order_id[:8].upper()} Processed - FUMU",
        recipients=recipients,
        body=html,
        subtype=MessageType.html
    )
    
    fm = FastMail(conf)
    await fm.send_message(message)

