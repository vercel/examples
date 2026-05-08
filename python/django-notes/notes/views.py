from django.conf import settings
from django.http import HttpResponseForbidden
from django.shortcuts import get_object_or_404, redirect, render

from .forms import NoteForm
from .models import Note


def note_list(request):
    notes = Note.objects.all()
    return render(request, "notes/list.html", {"notes": notes})


def note_create(request):
    if settings.READ_ONLY:
        return HttpResponseForbidden("This demo is read-only.")
    if request.method == "POST":
        form = NoteForm(request.POST)
        if form.is_valid():
            note = form.save()
            return redirect("note_detail", pk=note.pk)
    else:
        form = NoteForm()
    return render(request, "notes/form.html", {"form": form, "action": "Create"})


def note_detail(request, pk):
    note = get_object_or_404(Note, pk=pk)
    return render(request, "notes/detail.html", {"note": note})


def note_edit(request, pk):
    if settings.READ_ONLY:
        return HttpResponseForbidden("This demo is read-only.")
    note = get_object_or_404(Note, pk=pk)
    if request.method == "POST":
        form = NoteForm(request.POST, instance=note)
        if form.is_valid():
            form.save()
            return redirect("note_detail", pk=note.pk)
    else:
        form = NoteForm(instance=note)
    return render(request, "notes/form.html", {"form": form, "action": "Edit", "note": note})


def note_delete(request, pk):
    if settings.READ_ONLY:
        return HttpResponseForbidden("This demo is read-only.")
    note = get_object_or_404(Note, pk=pk)
    if request.method == "POST":
        note.delete()
        return redirect("note_list")
    return redirect("note_detail", pk=note.pk)
