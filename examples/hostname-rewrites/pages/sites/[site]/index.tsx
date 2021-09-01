import Link from 'next/link'

export default function Index(props){

    return (
        <>
        <div>
            <h1>{props.name}</h1>
        </div>
        <div>
            <Link href="/">
                <a style={{marginRight: "10px"}}>Home</a>
            </Link>
            <Link href="/about">
                <a>About</a>
            </Link>
        </div>
        <div>
            <p>More examples:</p>
            <ul>
                <li><a href="https://hostname-1.vercel.sh">hostname-1.vercel.sh</a></li>
                <li><a href="https://hostname-2.vercel.sh">hostname-2.vercel.sh</a></li>
                <li><a href="https://hostname-3.vercel.sh">hostname-3.vercel.sh</a></li>
                <li><a href="https://custom-domain-1.com">custom-domain-1.com</a></li>
            </ul>
        </div>
        </>
    )
}

const mockDB = [
    {name: "Hostname 1", subdomain: "hostname-1", customDomain: "custom-domain-1.com"},
    {name: "Hostname 2", subdomain: "hostname-2", customDomain: null},
    {name: "Hostname 3", subdomain: "hostname-3", customDomain: null},
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
    const data = mockDB.filter(item => customDomain ? item.customDomain == site : item.subdomain == site);
    console.log(site)

    return { 
        props: {...data[0]},
        revalidate: 10 // set revalidate interval of 10s
    }
}