# coding: utf-8
from django.conf.urls.defaults import patterns
from voting.views import vote_on_object
from mezzanine_social_polls.models import Choice

choice_dict = {
    'model': Choice,
    'template_object_name': 'choice',
    'allow_xmlhttprequest': True,
    'template_name':'pages/poll.html'
}

urlpatterns = patterns("",
    (r'^choice/(?P<object_id>\d+)/(?P<direction>up|down|clear)vote/?$', vote_on_object, choice_dict),
)
