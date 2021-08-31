import Link from 'next/link'

export default function Index() {
    return (
        <>
        <div>
            <h1>A/B Testing Example</h1>
        </div>
        <div>
            <Link href="/home"><a>Open this link in your browser and incognito</a></Link>
        </div>
        </>
    )
}