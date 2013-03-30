from django.http import HttpResponseRedirect
from mezzanine.pages.page_processors import processor_for
from .models import Poll, Choice, PollContainer
from .forms import PollForm, ChoiceForm


@processor_for(PollContainer)
def poll_container(request, page):
    if request.method == 'POST':
        id = int(request.POST.get('id'))
        if id == 0:
            poll = Poll(parent=page, in_menus=True, user=request.user)
        elif id > 0:
            poll = Poll.objects.get(pk=id)
        form = PollForm(request.POST, instance=poll)
        if form.is_valid():
            form.save()
            redirect = request.path + "?submitted=true"
            return HttpResponseRedirect(redirect)

    form = PollForm()
    return {"form":form}



@processor_for(Poll)
def voting_form(request, page):
    if request.method == 'POST':
        id = int(request.POST.get('id'))
        if id == 0:
            choice = Choice(parent=page, in_menus=True, user=request.user)
        elif id > 0:
            choice = Choice.objects.get(pk=id)
        form = ChoiceForm(request.POST, instance=choice)
        if form.is_valid():
            form.save()
            redirect = request.path + "?submitted=true"
            return HttpResponseRedirect(redirect)

    form = ChoiceForm()
    return {"form":form}


