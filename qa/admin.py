from django.contrib import admin
from django.utils.translation import ugettext as _
from mezzanine.pages.admin import PageAdmin
from .models import QAContainner, QA
from copy import deepcopy




admin.site.register(QAContainner, PageAdmin)
admin.site.register(QA, PageAdmin)

