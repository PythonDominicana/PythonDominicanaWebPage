from copy import deepcopy

from django.contrib import admin

from mezzanine.pages.models import RichTextPage

from mezzanine.core.admin import TabularDynamicInlineAdmin
from mezzanine.pages.admin import PageAdmin
from mezzanine.forms.admin import FormAdmin
from mezzanine.galleries.admin import GalleryAdmin

try:
    from cartridge.shop.models import Category
    from cartridge.shop.admin import CategoryAdmin
    cartridge = True
except ImportError:
    cartridge = False

from .models import Slide


"""
We do what we do here instead of just attaching it to PageAdmin because more
things then just pages inherit PageAdmin and if we just inject it into PageAdmin
I've had some very bad things happen. Thus I inject it into each page type
individually in a way that best suits it.
"""


class SlideInline(TabularDynamicInlineAdmin):
    model = Slide


class RichTextPageAdmin(PageAdmin):
    inlines = (SlideInline,)

admin.site.unregister(RichTextPage)
admin.site.register(RichTextPage, RichTextPageAdmin)

FormAdmin.inlines += (SlideInline,)
GalleryAdmin.inlines += (SlideInline,)


if cartridge:
    class CategoryAdminInline(CategoryAdmin):
        inlines = (SlideInline,)

    admin.site.unregister(Category)
    admin.site.register(Category, CategoryAdminInline)
