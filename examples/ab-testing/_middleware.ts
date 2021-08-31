export function middleware(req, res) {
    let bucket = req.cookies.bucket;
    if (!bucket) {
      bucket = Math.random() >= 0.5 ? 'a' : 'b';
      res.cookie('bucket', bucket);
    }
  
    res.rewrite(`/home/${bucket}`);

}