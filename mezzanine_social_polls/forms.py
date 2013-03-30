from django import forms
from django.forms import ModelForm
from .models import Poll, Choice

class PollForm(ModelForm):

    class Meta:
        model=Poll
        fields = ('title',)

class ChoiceForm(ModelForm):

    class Meta:
        model=Choice
        fields = ('title',)