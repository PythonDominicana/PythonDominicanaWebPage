from django import forms
from django.forms import ModelForm
from .models import QAContainner, QA

class PollForm(ModelForm):

    class Meta:
        model=QAContainner
        fields = ('title',)

class ChoiceForm(ModelForm):

    class Meta:
        model=QA
        fields = ('title',)