export default function Index(props){

    return (
        <>
        <div>
            <h1>{props.name}</h1>
            <p>Subdomain: {props.subdomain}.vercel.sh</p>
            {
                props.customDomain &&
                <p>Custom Domain: {props.customDomain}</p>
            }
        </div>
        <div>
            <a href="https://test-site-1.vercel.sh">test-site-1.vercel.sh  •</a>
            <a href="https://test-site-2.vercel.sh">  test-site-2.vercel.sh  •</a>
            <a href="https://test-site-3.vercel.sh">  test-site-3.vercel.sh</a>
        </div>
        </>
    )
}

const mockDB = [
    {name: "Test Site", subdomain: "test-site-1", customDomain: "test-site-vercel.com"},
    {name: "Test Site 2", subdomain: "test-site-2", customDomain: null},
    {name: "Test Site 3", subdomain: "test-site-3", customDomain: null},
]

export async function getStaticPaths() {

    // get all sites that have subdomains set up
    const subdomains = mockDB.filter(item => item.subdomain)

    // get all sites that have custom domains set up
    const customDomains = mockDB.filter(item => item.customDomain)
    
    // build paths for each of the sites in the previous two lists
    const paths = [...subdomains.map((item) => {return { params: { site: item.subdomain } }}), 
                      ...customDomains.map((item) => {return { params: { site: item.customDomain } }})]
    return {
        paths: paths,
        fallback: "blocking" // fallback blocking allows sites to be generated using ISR
    }
}

export async function getStaticProps({ params: {site} }) {

    // check if site is a custom domain or a subdomain
    const customDomain = site.includes('.') ? true : false
  
    // fetch data from mock database using the site value as the key
    const data = mockDB.filter(item => item.subdomain == site);

    return { 
        props: {...data[0]},
        revalidate: 10 // set revalidate interval of 10s
    }
}