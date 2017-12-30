from tastypie.authentication import Authentication

class JwtAuthentication(Authentication):
    def is_authenticated(self, request, **kwargs):
        return True

    # Optional but recommended
    def get_identifier(self, request):
        return 'papo'
