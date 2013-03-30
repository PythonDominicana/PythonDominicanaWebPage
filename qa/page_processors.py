from django.http import HttpResponseRedirect
from mezzanine.pages.page_processors import processor_for
from .models import QAContainner
from .forms import PollForm, ChoiceForm
from qa.models import QA


@processor_for(QAContainner)
def poll_container(request, page):
    if request.method == 'POST':
        id = int(request.POST.get('id'))
        if id == 0:
            qa = QA(parent=page, in_menus=True, user=request.user)
        elif id > 0:
            qa = QA.objects.get(pk=id)
        form = PollForm(request.POST, instance=qa)
        if form.is_valid():
            form.save()
            redirect = request.path + "?submitted=true"
            return HttpResponseRedirect(redirect)

    form = PollForm()
    return {"form":form}
