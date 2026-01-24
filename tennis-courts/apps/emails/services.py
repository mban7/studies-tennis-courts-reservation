from django.core.mail import send_mail
from django.conf import settings


class EmailService:
    @staticmethod
    def send_welcome_email(user):
        subject = 'Welcome to Tennis Courts Reservation System'
        message = f"""
Hello {user.first_name or user.email},

Welcome to our Tennis Courts Reservation System!

Your account has been successfully created.

Email: {user.email}

You can now log in and start making reservations for our tennis courts.

Thank you for joining us!
"""
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )

    @staticmethod
    def send_reservation_confirmation(reservation):
        subject = f'Reservation Confirmation - {reservation.court.name}'
        message = f"""
Hello {reservation.user.first_name or reservation.user.email},

Your reservation has been confirmed!

Court: {reservation.court.name}
Address: {reservation.court.street}, {reservation.court.city} {reservation.court.postal_code}
Date: {reservation.start_at.strftime('%Y-%m-%d')}
Time: {reservation.start_at.strftime('%H:%M')} - {reservation.end_at.strftime('%H:%M')}
Players: {reservation.players_count}
Total Amount: ${reservation.total_amount}

Status: {reservation.status.upper()}

{reservation.additional_info if reservation.additional_info else ''}

Thank you for choosing our tennis courts!
"""
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [reservation.user.email],
            fail_silently=False,
        )

    @staticmethod
    def send_reservation_cancellation(reservation):
        subject = f'Reservation Canceled - {reservation.court.name}'
        message = f"""
Hello {reservation.user.first_name or reservation.user.email},

Your reservation has been canceled.

Court: {reservation.court.name}
Date: {reservation.start_at.strftime('%Y-%m-%d')}
Time: {reservation.start_at.strftime('%H:%M')} - {reservation.end_at.strftime('%H:%M')}

If you have any questions, please contact us.
"""
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [reservation.user.email],
            fail_silently=False,
        )
