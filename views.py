from django.shortcuts import render
from django.contrib import messages

from django.shortcuts import render, redirect
from django.views import View
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin

from django.contrib.auth.models import User, Group

from .models import Card, Session, Position
from .forms import SessionNameForm, UserForm

import json

class Sess(LoginRequiredMixin, View):
    login_url = '/login/'

    def render_session_context(self, add_session_form, user_form, client_with_sessions, profi):
        return {'add_session_form': add_session_form, 'user_form': user_form,
                'client_with_sessions': client_with_sessions, 'profi': profi}

    def get(self, request):
        is_profi = request.user.groups.filter(name='profi').exists()
        context = self.render_session_context(SessionNameForm(), UserForm(),
                                    Session.client_with_sessions(request.user, is_profi), is_profi)

        return render(request, 'session.html', context)

    def post(self, request):
        if request.user.groups.filter(name='client').exists():  # if it is client
            return redirect('/')

        if None not in (request.POST.get('username'), request.POST.get('password')):
            userform = UserForm(request.POST)
            if not userform.is_valid():
                context = self.render_session_context(SessionNameForm(), userform,
                                                      Session.client_with_sessions(request.user),
                                                      request.user.groups.filter(name='profi').exists())
                return render(request, 'session.html', context)

            us = User(username=request.POST.get('username'), password=request.POST.get('password'))
            us.save()
            us.groups.add(Group.objects.get(name='client'))
            return redirect('/')

        if None not in (request.POST.get('name'), request.POST.get('inputUser')):
            snf = SessionNameForm(request.POST)
            if not snf.is_valid():
                context = self.render_session_context(SessionNameForm(), UserForm(),
                                                      Session.client_with_sessions(request.user),
                                                      request.user.groups.filter(name='profi').exists())
                context['formerror'] = snf
                return render(request, 'session.html', context)
            new_sess = Session(name=request.POST['name'], prof=request.user.pk, client=User.objects.get(username=request.POST['inputUser']).pk)
            new_sess.save()
            return redirect(f'/sess/{new_sess.pk}')

        return redirect('/')


class Board(LoginRequiredMixin, View):
    login_url = '/login/'

    def get(self, request, pk=None):
        positions = Position.objects.filter(session=Session.objects.get(pk=pk))

        context = {
            'max_cards': len(Card.objects.all()),
            'session_id': pk,
            'is_prof': 1 if request.user.groups.filter(name='profi').exists() else 0,
            'positions': positions
        }
        if pk is None:
            return redirect('/')


        return render(request, 'board.html', context)


class UCon(LoginRequiredMixin, View):

    def get(self, request):
        context = {}
        return render(request, 'under_construction.html', context)

    def post(self, request, *args, **kwargs):
        context = {}
        return render(request, 'under_construction.html', context)


class SessHandler(LoginRequiredMixin, View):

    def get(self, request, pk):
        res = [{'card_id': pos.card_id, 'top': pos.top, 'left': pos.left} for pos in Position.objects.filter(session=Session.objects.get(pk=pk))]
        return JsonResponse({'res': res})

    def post(self, request, pk=None):
        data = json.loads(request.body.decode())

        if data.get('reset'):
            pos = Position.objects.filter(session=Session.objects.get(pk=pk))
            pos.delete() if pos.exists() else None
            return JsonResponse({'res': 'ok'})

        if request.user.groups.filter(name='profi').exists():  # if profi -> not load position
            return JsonResponse({'res': 'ok'})

        session = Session.objects.get(pk=pk)
        Position.update_position(session, data['id'], data['top'], data['left'], data['cb'])
        return JsonResponse({'res': 'ok'})

