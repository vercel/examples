from django.db import migrations, models


def seed_initial_note(apps, schema_editor):
    Note = apps.get_model("notes", "Note")
    Note.objects.create(title="Hello", body="world!")
    Note.objects.create(title="Try it yourself", body="This demo is read-only. Deploy your own copy to create, edit, and delete notes.")
    Note.objects.create(title="Django on Vercel", body="This app runs on Vercel Serverless Functions using the Python runtime.")


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Note",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=200)),
                ("body", models.TextField()),
            ],
        ),
        migrations.RunPython(seed_initial_note, migrations.RunPython.noop),
    ]
