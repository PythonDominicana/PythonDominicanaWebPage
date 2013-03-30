from django.contrib import admin
from django.utils.translation import ugettext as _
from mezzanine.pages.admin import PageAdmin
from .models import Poll, Choice, PollContainer
from copy import deepcopy




admin.site.register(PollContainer, PageAdmin)
admin.site.register(Poll, PageAdmin)
admin.site.register(Choice, PageAdmin)

