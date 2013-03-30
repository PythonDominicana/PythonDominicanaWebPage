from django.db import models
from django.utils.translation import ugettext as _
from django.contrib.auth.models import User

from mezzanine.pages.models import Page
from mezzanine.core.models import RichText

class PollContainer(Page):

    def __unicode__(self):
        return u'%s' % (self.title, )

    class Meta:
        verbose_name = _('Poll container')


class Poll(Page):
    user    = models.ForeignKey(User)
    def __unicode__(self):
        return u'%s' % (self.title, )

    class Meta:
        verbose_name = _('Poll')


class Choice(Page):
    user = models.ForeignKey(User)

    def __unicode__(self):
        return self.title

    class Meta:
        verbose_name = _('Choice')