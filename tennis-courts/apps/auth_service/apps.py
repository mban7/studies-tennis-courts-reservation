from django.apps import AppConfig


class AuthConfig(AppConfig):
    name = 'apps.auth_service'

    def ready(self):
        import apps.auth_service.schema