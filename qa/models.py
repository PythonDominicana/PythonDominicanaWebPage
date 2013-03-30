from django.db import models
from django.utils.translation import ugettext as _
from django.contrib.auth.models import User

from mezzanine.pages.models import Page
from mezzanine.core.models import RichText

class QAContainner(Page):

    def __unicode__(self):
        return u'%s' % (self.title, )

    class Meta:
        verbose_name = _('Preguntas container')


class QA(Page):
    user    = models.ForeignKey(User)
    def __unicode__(self):
        return u'%s' % (self.title, )

    class Meta:
        verbose_name = _('Preguntas')