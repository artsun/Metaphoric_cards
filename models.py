from django.db import models

from django.contrib.auth.models import User, Group
from collections import OrderedDict


class Card(models.Model):
    title = models.CharField(max_length=5, primary_key=True, null=False)
    image = models.FilePathField(path="")

    def __str__(self):
        return f'Карта {self.title}'


class Session(models.Model):
    name = models.CharField(max_length=32, verbose_name='Название сессии', null=False)
    prof = models.IntegerField(verbose_name='Психолог', null=False)
    client = models.IntegerField(verbose_name='Клиент', null=False)
    stamp = models.DateTimeField(auto_now_add=True, verbose_name='Дата/время', null=False, blank=True, editable=False)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return f"/{self.pk}"

    @staticmethod
    def client_with_sessions(user, is_profi=True):
        if not is_profi:
            return Session.objects.filter(client=user.pk)
        od = OrderedDict()
        [od.update({us: Session.objects.filter(prof=user.pk, client=us.pk)}) for us in User.objects.all().order_by('pk')
         if us.groups.filter(name='client').exists()]
        return od


class Position(models.Model):
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='positions')
    card_id = models.CharField(max_length=5, editable=False)
    top = models.CharField(max_length=16, editable=False)
    left = models.CharField(max_length=16, editable=False)
    cb = models.CharField(max_length=64, editable=False)

    @staticmethod
    def update_position(sess, id, top, left, cb):
        pos = Position.objects.filter(session=sess, card_id=id)
        if pos.exists():
            pos = pos.last()
            pos.top, pos.left, pos.cb = top, left, cb
            pos.save(force_update=True)
        else:
            pos = Position(session=sess, card_id=id, top=top, left=left, cb=cb)
            pos.save()
