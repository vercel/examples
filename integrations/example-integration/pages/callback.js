import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from 'components/layout'
import Loader from 'components/loader'

export default function CallbackPage() {
  const router = useRouter()
  const [data, setData] = useState({})
  const [projects, setProjects] = useState()

  useEffect(() => {
    const fetchAccessToken = async (code) => {
      const res = await fetch(`/api/get-access-token?code=${code}`)
      const json = await res.json()

      setData({
        accessToken: json.access_token,
        userId: json.user_id,
        teamId: json.team_id
      })
    }

    if (router.isReady && !data.accessToken) {
      const { code } = router.query
      fetchAccessToken(code)
    }
  }, [router])

  useEffect(() => {
    const fetchProjects = async (accessToken, teamId) => {
      if (accessToken) {
        {/* If we have a teamId, all calls to the Vercel API should have it attached as a query parameter */ }
        const res = await fetch(`https://api.vercel.com/v4/projects${teamId ? `?teamId=${teamId}` : ''}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        const json = await res.json()

        setProjects(json.projects)
      }
    }

    const { accessToken, teamId } = data
    fetchProjects(accessToken, teamId)
  }, [data])

  return (
    <Layout>
      <div className="w-full max-w-2xl divide-y">
        <section className="py-4 flex items-center space-x-2 justify-center">
          <h1 className="text-lg font-medium">Integration is installed on a</h1>

          {data.accessToken && (
            <div className="rounded-md bg-blue-500 text-white text-sm px-2.5 py-0.5">
              {/* If we have a teamId, the installation is made on a team */}
              {data.userId && data.teamId ? 'team' : 'personal account'}
            </div>
          )}
        </section>

        <section className="py-4">
          <h1 className="text-lg font-medium">Data:</h1>
          <div className="mt-1">
            {data.accessToken ? (
              <pre className="text-sm">
                {JSON.stringify(data, null, '  ')}
              </pre>
            ) : <Loader />}
          </div>
        </section>

        <section className="py-4">
          <h1 className="text-lg font-medium">Projects:</h1>
          <div className="mt-1">
            {projects ? (
              <div className="grid grid-cols-3 gap-x-4 gap-y-2">
                {projects.map(project => (
                  <div key={project.id} className="truncate">
                    {project.name}
                  </div>
                ))}
              </div>
            ) : <Loader />}
          </div>
        </section>

        <section className="py-4 flex justify-center">
          {/* This redirect should happen programmatically if you're done with everything on your side */}
          <button
            className="bg-black hover:bg-gray-900 text-white px-6 py-1 rounded-md"
            onClick={() => {
              router.push(router.query.next)
            }}
          >Redirect me back to Vercel</button>
        </section>
      </div>
    </Layout>
  )
}
