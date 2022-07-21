const fs = require('fs');

const clientJS = fs.readFileSync(__dirname + '/client.js').toString();

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')

  // NOTE: the below revalidate link is meant for demo purposes only
  // actual authentication should be used in actual projects
  res.end(`
    <h1>On-Demand Incremental Static Regeneration (ISR) Example</h1>
    
    
    <h2>HTML Content</h2>
    <p>The "Server Time" below will only get updated after you click the Revalidate link.</p>
    <p>Server Time: ${new Date().toISOString()}</p>
    
    <!-- Authentication example is for demo purposes only. In a production system, use better authentication strategies. -->
    <p><a href="/revalidate?path=/&authToken=a13f94f6-a441-47ca-95fc-9f44f3450295">Revalidate Index</a></p>
    
    
    <h2>API Content</h2>
    <p>The "API Result" below will only get updated after you click the Revalidate link.</p>

    <p>API Result: <span id="result"></span></p>
    <script>${clientJS}</script>

    <!-- Authentication example is for demo purposes only. In a production system, use better authentication strategies. -->
    <p><a href="/revalidate?path=/data&authToken=a13f94f6-a441-47ca-95fc-9f44f3450295">Revalidate Data</a></p>
`)
}
