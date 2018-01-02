from tastypie.authorization import Authorization
from tastypie.exceptions import Unauthorized

class UsersAuthorization(Authorization):
    def read_list(self, object_list, bundle):
        # This assumes a ``QuerySet`` from ``ModelResource``.
        user = bundle.request.user
        if not user.is_superuser:
            return object_list.all()
        else:
            raise Unauthorized("")
