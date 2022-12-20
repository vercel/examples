from flask import Flask, render_template, url_for, request, redirect,session, flash, send_file, current_app
from flask_sqlalchemy import SQLAlchemy 
from werkzeug.utils import secure_filename
from flask_mail import Mail
import json
from datetime import datetime
import os 
import math
import logging
import os.path 
# for background remover
from rembg import remove
from PIL import Image


with open('config.json', 'r') as j:
    parameters = json.load(j)['parameters']

local_server = True
app = Flask(__name__) 

app.secret_key = "Hello"
app.config['UPLOAD_FOLDER'] = parameters['upload_location']
app.config['without_Bg_UPLOAD_FOLDER'] = parameters['bgremove_upload_location']

app.config.update(
    MAIL_SERVER = 'smtp.gmail.com',
    MAIL_PORT = 465,
    MAIL_USE_SSL = True,
    MAIL_USERNAME = parameters['gmail_user'],
    MAIL_PASSWORD = parameters['gmail_password']
)

mail = Mail(app)
if(local_server):
    app.config['SQLALCHEMY_DATABASE_URI'] = parameters['local_uri']
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = parameters['production_url']

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

class Contact(db.Model):
    sno = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(20), nullable=False)
    phone_num = db.Column(db.String(12), nullable=False)
    msg = db.Column(db.String(200), nullable=False)
    # date = db.Column(db.String(20), nullable=True)
    date = datetime.now()


class Posts(db.Model):
    sno = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    slug = db.Column(db.String(20), nullable=False)
    content = db.Column(db.String(200), nullable=False)
    tagline = db.Column(db.String(200), nullable=False)
    # date = db.Column(db.String(20), nullable=False)
    date = datetime.now()

class Signup(db.Model):
    sno = db.Column(db.Integer, primary_key=True)
    fname = db.Column(db.String(20), nullable=False)
    lname = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(20), nullable=False)
    password = db.Column(db.String(30), nullable=False)
    date = datetime.now()


@app.route("/", methods=["GET", "POST"])
def home():
    return render_template('index.html', parameters=parameters)

@app.route("/contact", methods=["GET", "POST"])
def contact():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        phone = request.form['phone']
        Message = request.form['msg']
        entry = Contact(name=name, email=email, phone_num=phone, msg=Message)
        db.session.add(entry)
        db.session.commit()
        mail.send_message('New message from ' + name,
                        sender = email, 
                        recipients = [parameters['gmail_user']],
                        body = Message + "\n" + phone
                        )
   
    return render_template("contact.html", parameters=parameters)


@app.route("/blog")
def blog():
    post = Posts.query.filter_by().all()
    last = math.ceil(len(post) / int(parameters['no_of_posts'] ))
    page = request.args.get('page', 1, type=int)
    if(not str(page).isnumeric()):
        page = 1

    # set the pagination configuration
    # post = Posts.query.paginate(page=page, per_page=parameters['no_of_posts'])
    # return render_template('post.html', parameters=parameters, post=post)

    page = int(page)
    # slicing
    post = post[(page -1) * int(parameters['no_of_posts']) : (page -1) * int(parameters['no_of_posts']) + int(parameters['no_of_posts'])]
    # # pagination logic
    # # STARTING
    if page == 1:
        prev = "#"
        next = "/?page=" +str(page + 1)
    # LAST
    elif page == last:
        prev = "/?page=" +str(page - 1)
        next = "#"
    # MIDDLE
    else:
        prev = "/?page=" +str(page - 1)
        next = "/?page=" +str(page + 1)
    
    # slug is unique
    return render_template('Blog-home.html', parameters=parameters, post=post, prev=prev, next=next)
    # return render_template('Blog-home.html', parameters=parameters, post=post)


@app.route("/post/<string:post_slug>", methods = ['GET','POST'] )
def post_route(post_slug):
    # slug is unique
    post = Posts.query.filter_by(slug=post_slug).all()
    return render_template('post.html', parameters=parameters, post=post)
    

@app.route("/download", methods=['GET', 'POST'])
def download():
    path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename('filename.png'))
    # path = os.path.join(current_app.root_path, app.config['UPLOAD_FOLDER'])
    return send_file(path, as_attachment=True)
            



@app.route("/remover", methods=['GET', 'POST'])
def bgremover():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        input_path = request.files['file']
        if input_path.filename == "":
            flash('No image selected for uploading ')
            return redirect(request.url)
        if input_path and allowed_file(input_path.filename):
            filename = secure_filename(input_path.filename)
            # for output file 
            without_bg_img = "chg_bg_" + filename
            output_path = app.config['without_Bg_UPLOAD_FOLDER']+filename
            input = Image.open(input_path)
            output = remove(input)
            output.save(output_path)     
            # for input file save 
            input_path.save(os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(input_path.filename)))
            flash('Image successfully uploaded and displayed below ')
            
            return render_template('showfile.html', parameters=parameters, filename=filename, without_bg_img=without_bg_img)
            
        else:
            flash('Allowed file types are - png, jpg, jpeg, gif ')
            return redirect(request.url)

    post = Posts.query.filter_by().first()
    return render_template('bgremover.html', parameters=parameters, post=post)
    
@app.route("/showfile")
def showfile():
    filename = request.args.get('filename')
    without_bg_img = request.args.get('without_bg_img')
    # return redirect(url_for('static', filename='uploads/' + filename), code=301)
    return render_template('showfile.html', parameters=parameters, filename=filename, without_bg_img=without_bg_img)

@app.route("/qrgenerator", methods=['GET', 'POST'])
def qrgenerator():
    return render_template('QrGenerator.html', parameters=parameters)


@app.route("/dashboard", methods=['GET', 'POST'])
def dashboard():
    if ('user' in session and session['user'] == parameters['admin_user']):
        post = Posts.query.all()
        return render_template('dashboard.html', parameters=parameters, post=post)

    if request.method == 'POST':
        username = request.form.get('uname')
        userpassword = request.form.get('password')
        if(username == parameters['admin_user'] and userpassword == parameters['admin_password']):
            # set the session variable
            session['user'] = username
            post = Posts.query.all()
            return render_template('dashboard.html', parameters=parameters, post=post)
    # else:
        return render_template('login.html', parameters=parameters)
    
@app.route("/edit/<string:sno>", methods=['GET', 'POST'])
def edit(sno):
    if 'user' in session and session['user'] == parameters['admin_user']:
        if request.method == 'POST':
            e_title = request.form.get('title')
            e_tline = request.form.get('tline')
            e_slug = request.form.get('slug')
            e_content = request.form.get('content')
            # e_img_file = request.form.get('img_file')
            date = datetime.now()

            if sno == '0':
                post = Posts(title=e_title, slug=e_slug, content=e_content, tagline=e_tline, date=date)
                db.session.add(post)
                db.session.commit()
                flash('New post added')
            else:
                post = Posts.query.filter_by(sno=sno).first()
                post.title = e_title
                post.slug = e_slug
                post.content = e_content
                post.tagline = e_tline
                post.date = date
                db.session.add(post)
                db.session.commit()
                return redirect('/dashboard')

        post = Posts.query.filter_by(sno=sno).first()
        return render_template('edit.html', parameters=parameters, post=post, sno=sno)
        
@app.route("/delete/<string:sno>", methods=['GET', 'POST'])
def delete(sno):
    if ('user' in session and session['user'] == parameters['admin_user']):
        post = Posts.query.filter_by(sno=sno).first()
        db.session.delete(post)
        db.session.commit()
    return redirect('/dashboard')
    
# @app.route("/edit/")
# def edited():
#     return render_template('dashboard.html', parameters=parameters, post=post)


@app.route("/logout")
def logout():
    session.pop('user')
    return redirect('/login')

@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == 'POST':
        S_fname = request.form['fname']
        S_lname = request.form['lname']
        S_email = request.form['email']
        password = request.form['password']
        Cpassword = request.form['Cpassword']
        date = datetime.now()
        if(password == Cpassword):
            entry = Signup(fname=S_fname, lname=S_lname,email=S_email,password=password, date=date)
            db.session.add(entry)
            db.session.commit()
            # mail.send_message('New message from ' + S_fname + S_lname,
            #                 sender = S_email, 
            #                 recipients = [parameters['gmail_user']],
            #                 body = Message + "\n" + phone
            #                 )
    # return render_template("contact.html", parameters=parameters)
    return render_template('signup.html', parameters=parameters)
    
@app.route("/python")
def python():
    return render_template('python.html', parameters=parameters)
    
@app.route("/pandas")
def pandas():
    return render_template('pandas.html', parameters=parameters)
    
@app.route("/numpy")
def numpy():
    return render_template('numpy.html', parameters=parameters)
    
@app.route("/ml", methods=['GET', 'POST'])
def ML():
    post = Posts.query.filter_by().all()        
    return render_template('ML.html', parameters=parameters, post=post)

@app.route("/mltutorial")
def mltutorial():
    return render_template('mltutorial.html', parameters=parameters)

# login 
@app.route("/login", methods=['GET', 'POST'])
def login():
    return render_template('login.html', parameters=parameters)


@app.route("/uploader", methods=['GET', 'POST'])
def uploader():
    if ('user' in session and session['user'] == parameters['admin_user']):
        if (request.method == 'POST'):
            ufile = request.files['file']
            ufile.save(os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(ufile.filename)))
            return "Uploaded successfully"

    
@app.route("/about")
def about():
    return render_template('about.html', parameters=parameters)
    

if __name__ == "__main__":
    from app import db, app
    
    with app.app_context():
        db.create_all()
        app.run(debug=True, host='0.0.0.0')
